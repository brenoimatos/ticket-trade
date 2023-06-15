"""Adding first_name and last_name column to user

Revision ID: a3948bd01f62
Revises: 228642a2b27a
Create Date: 2023-06-14 21:44:42.413388

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = 'a3948bd01f62'
down_revision = '228642a2b27a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('first_name', sa.String(), nullable=True))
    op.add_column('user', sa.Column('last_name', sa.String(), nullable=True))
    op.alter_column('user', 'phone',
               existing_type=sa.BigInteger(),
               nullable=False)
    op.create_unique_constraint(None, 'user', ['phone'])
    op.drop_column('user', 'name')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'user', type_='unique')
    op.alter_column('user', 'phone',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.drop_column('user', 'last_name')
    op.drop_column('user', 'first_name')
    # ### end Alembic commands ###
