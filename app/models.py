from typing import List, Optional
from sqlalchemy import Integer, String, Text, DateTime, Boolean, func, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY

from .database import Base


class Group(Base):
    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False, unique=True, index=True)
    created_at: Mapped[Optional[str]] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Word(Base):
    __tablename__ = "words"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    text: Mapped[str] = mapped_column(String(255), index=True, nullable=False)

    main_translation: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    alt_translations: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String(255)), nullable=True)

    tags: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String(64)), nullable=True)
    group_id: Mapped[Optional[int]] = mapped_column(ForeignKey("groups.id", ondelete="SET NULL"), nullable=True, index=True)
    group_name: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)  # Legacy field, kept for migration

    usage_example: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    usage_example_translation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    uses_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    to_teach: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    created_at: Mapped[Optional[str]] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_used_at: Mapped[Optional[str]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    group: Mapped[Optional["Group"]] = relationship("Group", lazy="joined")
    synonyms: Mapped[List["WordRelation"]] = relationship(
        "WordRelation",
        foreign_keys="WordRelation.word_id",
        back_populates="word",
        lazy="select",
        passive_deletes=True
    )
    synonym_of: Mapped[List["WordRelation"]] = relationship(
        "WordRelation",
        foreign_keys="WordRelation.related_word_id",
        back_populates="related_word",
        lazy="select",
        passive_deletes=True
    )


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[Optional[str]] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[Optional[str]] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(16), nullable=False)  # 'user' | 'assistant'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[Optional[str]] = mapped_column(DateTime(timezone=True), server_default=func.now())


class WordRelation(Base):
    __tablename__ = "word_relations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    word_id: Mapped[int] = mapped_column(ForeignKey("words.id", ondelete="CASCADE"), nullable=False, index=True)
    related_word_id: Mapped[int] = mapped_column(ForeignKey("words.id", ondelete="CASCADE"), nullable=False, index=True)
    relation_type: Mapped[str] = mapped_column(String(32), nullable=False, default="synonym")
    created_at: Mapped[Optional[str]] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    word: Mapped["Word"] = relationship("Word", foreign_keys=[word_id], back_populates="synonyms")
    related_word: Mapped["Word"] = relationship("Word", foreign_keys=[related_word_id], back_populates="synonym_of")

    __table_args__ = (
        UniqueConstraint('word_id', 'related_word_id', 'relation_type', name='uq_word_relation'),
    )


class Setting(Base):
    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)

    __table_args__ = (
        UniqueConstraint("key", name="uq_settings_key"),
    )

