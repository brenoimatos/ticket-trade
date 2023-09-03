import asyncio
from concurrent.futures import ThreadPoolExecutor

import pandas as pd

from app.dal.users import UserDal
from app.models.user import User
from app.utils.process_data import fill_missing_days, transform_to_cumulative


class UserService:
    def __init__(self, user_dal: UserDal):
        self.dal = user_dal
    
    async def get_dash_users(self, skip: int, limit: int) -> list[User]:
        return await self.dal.get_dash_users(skip=skip, limit=limit)
    
    async def get_dash_users_stats(self) -> list[dict]:
        rows = await self.dal.get_dash_users_stats()
        loop = asyncio.get_event_loop()
        df_filled = await loop.run_in_executor(
            ThreadPoolExecutor(), fill_missing_days, 
            rows, ['created_date', 'users'], 'created_date'
        )
        return (
            transform_to_cumulative(df_filled, ['users'])
            .to_dict(orient='records')
        )
    
    async def get_total_users_count(self) -> int:
        return await self.dal.get_total_users_count()

    