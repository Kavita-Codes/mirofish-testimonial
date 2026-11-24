import os
import json
import uuid
import threading
from datetime import datetime
from typing import Dict, Any, List, Optional
from .config import Config

class FileStorageFallback:
    """Thread-safe persistent JSON storage with MongoDB-like collection semantics."""
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.lock = threading.Lock()
        self._data: Dict[str, Dict[str, Any]] = {
            'campaigns': {},
            'reels': {},
            'simulations': {},
            'scores': {},
            'reports': {}
        }
        self._load()

    def _load(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, 'r', encoding='utf-8') as f:
                    self._data = json.load(f)
            except Exception as e:
                print(f"[DatabaseFallback] Warning loading data file: {e}")

    def _save(self):
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        temp_file = self.filepath + '.tmp'
        try:
            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(self._data, f, ensure_ascii=False, indent=2, default=str)
            if os.path.exists(self.filepath):
                os.replace(temp_file, self.filepath)
            else:
                os.rename(temp_file, self.filepath)
        except Exception as e:
            print(f"[DatabaseFallback] Warning saving data file: {e}")

    def get_collection(self, name: str):
        return MockCollection(self, name)

class MockCollection:
    def __init__(self, storage: FileStorageFallback, name: str):
        self.storage = storage
        self.name = name

    def _get_items(self) -> Dict[str, Any]:
        if self.name not in self.storage._data:
            self.storage._data[self.name] = {}
        return self.storage._data[self.name]

    def insert_one(self, doc: Dict[str, Any]):
        with self.storage.lock:
            items = self._get_items()
            doc_id = str(doc.get('_id') or doc.get('id') or uuid.uuid4())
            doc['_id'] = doc_id
            doc['id'] = doc_id
            doc['created_at'] = doc.get('created_at', datetime.utcnow().isoformat())
            doc['updated_at'] = datetime.utcnow().isoformat()
            items[doc_id] = doc.copy()
            self.storage._save()
            return MockInsertResult(doc_id)

    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with self.storage.lock:
            items = self._get_items()
            for doc in items.values():
                if self._matches(doc, query):
                    return doc.copy()
            return None

    def find(self, query: Optional[Dict[str, Any]] = None, sort: Optional[List[tuple]] = None) -> List[Dict[str, Any]]:
        with self.storage.lock:
            items = self._get_items()
            results = []
            for doc in items.values():
                if not query or self._matches(doc, query):
                    results.append(doc.copy())
            if sort:
                for key, direction in reversed(sort):
                    results.sort(key=lambda x: x.get(key, ''), reverse=(direction < 0))
            return results

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        with self.storage.lock:
            items = self._get_items()
            for doc_id, doc in items.items():
                if self._matches(doc, query):
                    if '$set' in update:
                        doc.update(update['$set'])
                    else:
                        doc.update(update)
                    doc['updated_at'] = datetime.utcnow().isoformat()
                    self.storage._save()
                    return MockUpdateResult(1)
            return MockUpdateResult(0)

    def delete_one(self, query: Dict[str, Any]):
        with self.storage.lock:
            items = self._get_items()
            to_delete = None
            for doc_id, doc in items.items():
                if self._matches(doc, query):
                    to_delete = doc_id
                    break
            if to_delete:
                del items[to_delete]
                self.storage._save()
                return MockDeleteResult(1)
            return MockDeleteResult(0)

    def count_documents(self, query: Optional[Dict[str, Any]] = None) -> int:
        return len(self.find(query))

    def _matches(self, doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
        for k, v in query.items():
            if k == '_id' or k == 'id':
                if str(doc.get('_id')) != str(v) and str(doc.get('id')) != str(v):
                    return False
            elif doc.get(k) != v:
                return False
        return True

class MockInsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id

class MockUpdateResult:
    def __init__(self, modified_count):
        self.modified_count = modified_count

class MockDeleteResult:
    def __init__(self, deleted_count):
        self.deleted_count = deleted_count

class Database:
    def __init__(self):
        Config.ensure_directories()
        self.is_real_mongo = False
        self.client = None
        self.db = None
        self.fallback = FileStorageFallback(Config.DATA_FILE)
        self._init_connection()

    def _init_connection(self):
        try:
            import pymongo
            client = pymongo.MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=1500)
            client.admin.command('ping')
            self.client = client
            self.db = client[Config.DB_NAME]
            self.is_real_mongo = True
            print(f"[Database] Successfully connected to live MongoDB at {Config.MONGO_URI}")
        except Exception as e:
            print(f"[Database] MongoDB service offline or unreachable ({e}). Using resilient persistent JSON document store at {Config.DATA_FILE}")
            self.is_real_mongo = False

    def get_collection(self, name: str):
        if self.is_real_mongo and self.db is not None:
            return self.db[name]
        return self.fallback.get_collection(name)

    @property
    def campaigns(self):
        return self.get_collection('campaigns')

    @property
    def reels(self):
        return self.get_collection('reels')

    @property
    def simulations(self):
        return self.get_collection('simulations')

    @property
    def scores(self):
        return self.get_collection('scores')

    @property
    def reports(self):
        return self.get_collection('reports')

db = Database()
