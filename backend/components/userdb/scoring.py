from __future__ import annotations

from pathlib import Path

from components.userdb.base import BaseDb
from datetime import datetime


class ScoreDB(BaseDb):
    def __init__(self, db_path: Path, day_created: int) -> None:
        super().__init__(db_path)
        self.db_path = db_path
        self._day_created = day_created

    def init_db(self) -> None:

        self.cur.execute(
            """
            create table if not exists TotalScore
            (id integer primary key,
            completed int not null,
            score double not null)
            """
        )
        self.cur.execute(
            """
            create table if not exists DailyScore
            (id integer primary key,
            score int not null)
            """
        )
        self.conn.commit()

    def clear_daily_score(self) -> None:
        self.cur.execute(
            """
            delete from DailyScore
            """
        )
        self.conn.commit()

    def get_user_id(self, username: str) -> int:
        id = self.cur.execute(f"select id from Users where username is ?", (username,)).fetchone()[
            0
        ]
        return int(id)

    def add_daily_score(self, id: int, score: float) -> bool:
        if not self.cur.execute(f"select * from DailyScore where id is ?", (id,)).fetchone():
            self.cur.execute(f"insert into DailyScore values (?, ?)", (id, score))
            self.conn.commit()
            return True
        return False

    def add_total_score(self, id: int, score: float) -> None:
        # get old score
        old_score = self.cur.execute(
            f"select score from TotalScore where id is ?", (id,)
        ).fetchone()
        if old_score:
            score += float(old_score[0])
        # get completed games
        counter = 1
        completed = self.cur.execute(
            f"select completed from TotalScore where id is ?", (id,)
        ).fetchone()
        if completed:
            counter += int(completed[0])
        # insert
        self.cur.execute(
            f"insert or replace into TotalScore values (?, ?, ?)", (id, counter, score)
        )
        self.conn.commit()

    def add_score(self, username: str, score: float) -> bool:
        if self._day_created != int(datetime.today().strftime("%d")):
            self.clear_daily_score()
        id = self.get_user_id(username)

        if self.add_daily_score(id, score):
            self.add_total_score(id, score)
            return True
        return False
