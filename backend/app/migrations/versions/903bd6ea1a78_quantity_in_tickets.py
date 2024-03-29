"""quantity in tickets

Revision ID: 903bd6ea1a78
Revises: b713623ac198
Create Date: 2023-07-22 14:21:54.606126

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '903bd6ea1a78'
down_revision = 'b713623ac198'
branch_labels = None
depends_on = None


def upgrade():
    # passo 1: adicionar a coluna com um valor padrão, mas permitir NULL
    op.add_column('ticket', sa.Column('quantity', sa.Integer, nullable=True, default=1))

    # passo 2: alterar a coluna para ser NOT NULL
    op.execute("UPDATE ticket SET quantity=1 WHERE quantity IS NULL")
    op.alter_column('ticket', 'quantity', nullable=False)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('ticket', 'quantity')
    # ### end Alembic commands ###
