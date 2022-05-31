from __future__ import annotations

import sqlite3
from abc import ABC, abstractmethod
from pathlib import Path

from typing_extensions import Self


class BaseDb(ABC):
    def __init__(self, db_path: Path) -> None:
        self.conn = sqlite3.connect(db_path)
        self.cur = self.conn.cursor()
        self.init_db()

    @abstractmethod
    def init_db(self) -> None:
        ...

    def __enter__(self) -> Self:
        return self

    def close(self) -> None:
        self.cur.close()
        self.conn.commit()
        self.conn.close()

    def __exit__(self, *args, **kwargs) -> None:
        self.close()
