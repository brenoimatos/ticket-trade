from sqlalchemy import Date, cast, desc, func, select
from sqlalchemy.orm import joinedload

from app.dal.db import Dal
from app.models.user import User


class UserDal(Dal):
    async def get_dash_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        query = select(User).options(
            joinedload(User.oauth_accounts)  # Eager load OAuthAccount records
        ).order_by(desc('created_at')).offset(skip).limit(limit)  # Apply pagination
        
        result = await self.session.execute(query)
        dash_users = result.scalars().unique().all()
        return dash_users

    async def get_dash_users_stats(self) -> list[User]:
        query = (
            select(cast(User.created_at, Date).label('created_date'), func.count(User.id).label("users"))
            .group_by("created_date")
            .order_by("created_date")
        )
        
        result = await self.session.execute(query)
        return result.fetchall()
    
    async def get_total_users_count(self) -> int:
        return await self.session.scalar(select(func.count(User.id)))

