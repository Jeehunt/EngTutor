"""add_word_relations_and_to_teach

Revision ID: 5f8b2c9d4567
Revises: 4e7a13ef134b
Create Date: 2025-11-05 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5f8b2c9d4567'
down_revision: Union[str, Sequence[str], None] = '4e7a13ef134b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Check if tables exist
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    tables = inspector.get_table_names()
    
    # Add to_teach column to words table
    if 'words' in tables:
        # Check if column already exists
        words_columns = [col['name'] for col in inspector.get_columns('words')]
        if 'to_teach' not in words_columns:
            op.add_column('words', sa.Column('to_teach', sa.Boolean(), nullable=False, server_default='true'))
            op.create_index(op.f('ix_words_to_teach'), 'words', ['to_teach'], unique=False)
    
    # Create word_relations table if it doesn't exist
    if 'word_relations' not in tables:
        op.create_table(
            'word_relations',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('word_id', sa.Integer(), nullable=False),
            sa.Column('related_word_id', sa.Integer(), nullable=False),
            sa.Column('relation_type', sa.String(length=32), nullable=False, server_default='synonym'),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.ForeignKeyConstraint(['word_id'], ['words.id'], ondelete='CASCADE'),
            sa.ForeignKeyConstraint(['related_word_id'], ['words.id'], ondelete='CASCADE'),
            sa.UniqueConstraint('word_id', 'related_word_id', 'relation_type', name='uq_word_relation')
        )
        op.create_index(op.f('ix_word_relations_id'), 'word_relations', ['id'], unique=False)
        op.create_index(op.f('ix_word_relations_word_id'), 'word_relations', ['word_id'], unique=False)
        op.create_index(op.f('ix_word_relations_related_word_id'), 'word_relations', ['related_word_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop word_relations table
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    tables = inspector.get_table_names()
    
    if 'word_relations' in tables:
        op.drop_index(op.f('ix_word_relations_related_word_id'), table_name='word_relations')
        op.drop_index(op.f('ix_word_relations_word_id'), table_name='word_relations')
        op.drop_index(op.f('ix_word_relations_id'), table_name='word_relations')
        op.drop_table('word_relations')
    
    # Drop to_teach column from words
    if 'words' in tables:
        words_columns = [col['name'] for col in inspector.get_columns('words')]
        if 'to_teach' in words_columns:
            op.drop_index(op.f('ix_words_to_teach'), table_name='words')
            op.drop_column('words', 'to_teach')




