from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Optional, Tuple


class UserDb:
    def __init__(self, asset_dir: Path) -> None:
        self.conn = sqlite3.connect(asset_dir / "user.db")
        self.cur = self.conn.cursor()
        self.cur.execute(
            """
            create table if not exists Users 
            (id integer primary key,
            username text not null unique,
            password text not null)
            """
        )
        self.conn.commit()

    def close(self) -> None:
        self.cur.close()
        self.conn.commit()
        self.conn.close()

    def __enter__(self) -> UserDb:
        return self

    def __exit__(self, *args, **kwargs) -> None:
        self.close()

    def add_user(self, username: str, password: str) -> Tuple[bool, Optional[Exception]]:
        if not username or not password:
            return (False, ...)
        try:
            self.cur.execute(
                f"insert into Users (username, password) values (?, ?)", (username, password)
            )
            self.conn.commit()
            return (True, ...)
        except Exception:
            return (False, ...)

    def retrieve_user(self, username: str, password) -> bool:
        selection = self.cur.execute(
            f"select * from Users where username is ? and password is ?", (username, password)
        ).fetchone()
        if selection:
            return True
        return False

    def delete_user(self, username: str, password: str) -> bool:
        ...

    def alter_user(self, username: str, password: str) -> bool:
        ...


if __name__ == "__main__":
    with UserDb(Path("./backend/assets")) as test_db:
        print(test_db.add_user("dominik", "123"))
        print(test_db.retrieve_user("elias", "123"))
        print(test_db.retrieve_user("dominik", "123"))
