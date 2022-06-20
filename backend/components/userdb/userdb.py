from __future__ import annotations

from hashlib import sha256
from pathlib import Path
from typing import Optional, Tuple

from components.userdb.base import BaseDb
from components.userdb.exceptions import (
    EmptyNameOrPasswordError,
    UserAlreadyExistsError,
    UserDoesNotExistError,
)


def encrypt(message: str) -> str:
    encryption = sha256()
    encryption.update(message.encode("utf_8"))
    return encryption.hexdigest()


def empty_user_or_password(func):
    def wrapper(_, username: str, password: str):
        if not username or not password:
            return False, EmptyNameOrPasswordError()
        return func(_, username, password)

    return wrapper


class UserDb(BaseDb):
    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)

    def init_db(self) -> None:
        self.cur.execute(
            """
            create table if not exists Users
            (id integer primary key,
            username text not null unique,
            password text not null)
            """
        )
        self.conn.commit()

    @empty_user_or_password
    def add_user(self, username: str, password: str) -> Tuple[bool, Optional[Exception]]:
        try:
            password = encrypt(password)
            self.cur.execute(
                f"insert into Users (username, password) values (?, ?)", (username, password)
            )
            self.conn.commit()
            return (True, None)
        except Exception:
            return False, UserAlreadyExistsError()

    @empty_user_or_password
    def retrieve_user(self, username: str, password) -> Tuple[bool, Optional[Exception]]:
        password = encrypt(password)
        selection = self.cur.execute(
            f"select * from Users where username is ? and password is ?", (username, password)
        ).fetchone()
        if selection:
            return True, None
        return False, UserDoesNotExistError()

    @empty_user_or_password
    def delete_user(self, username: str, password: str) -> bool:
        ...

    @empty_user_or_password
    def alter_user(self, username: str, password: str) -> bool:
        ...


if __name__ == "__main__":
    with UserDb(Path("./backend/assets/user.db")) as test_db:
        print(test_db.add_user("dominik", "123"))
        print(test_db.add_user("dominik", "123"))
        print(test_db.add_user("", "123"))
        print(test_db.retrieve_user("elias", "123"))
        print(test_db.retrieve_user("dominik", "123"))
