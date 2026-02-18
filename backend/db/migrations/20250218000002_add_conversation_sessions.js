exports.up = (pgm) => {
  pgm.createTable('conversation_sessions', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    mode: { type: 'varchar(30)', notNull: true },
    status: { type: 'varchar(20)', notNull: true, default: 'active' },
    asked_count: { type: 'integer', notNull: true, default: 0 },
    target_count: { type: 'integer', notNull: true },
    session_date: { type: 'date', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('conversation_sessions', 'user_id');
  pgm.createIndex('conversation_sessions', ['user_id', 'session_date', 'status']);
};

exports.down = (pgm) => {
  pgm.dropTable('conversation_sessions');
};
