import asyncio
from concurrent.futures import ThreadPoolExecutor

from app.dal.users import UserDal
from app.models.user import User
from app.utils.process_data import fill_missing_days


class UserService:
    def __init__(self, user_dal: UserDal):
        self.dal = user_dal
    
    async def get_dash_users(self, skip: int, limit: int) -> list[User]:
        return await self.dal.get_dash_users(skip=skip, limit=limit)
    
    async def get_dash_users_stats(self):
        rows = await self.dal.get_dash_users_stats()
        loop = asyncio.get_event_loop()
        filled_rows = await loop.run_in_executor(
            ThreadPoolExecutor(), fill_missing_days, 
            rows, ['created_date', 'users'], 'created_date'
        )
        return filled_rows
    
    async def get_total_users_count(self) -> int:
        return await self.dal.get_total_users_count()

    