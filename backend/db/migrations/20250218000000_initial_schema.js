exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(255)' },
    language: { type: 'varchar(10)' },
  });

  pgm.createTable('threads', {
    id: 'id',
    title: { type: 'varchar(500)', notNull: true },
    status: { type: 'varchar(20)', notNull: true, default: 'open' },
    importance_score: { type: 'numeric(5,2)' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('messages', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    role: { type: 'varchar(20)', notNull: true },
    content: { type: 'text', notNull: true },
    timestamp: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('messages', 'user_id');

  pgm.createTable('events', {
    id: 'id',
    thread_id: {
      type: 'integer',
      notNull: true,
      references: '"threads"',
      onDelete: 'CASCADE',
    },
    summary: { type: 'text' },
    sentiment: { type: 'varchar(50)' },
    significance_score: { type: 'numeric(5,2)' },
  });
  pgm.createIndex('events', 'thread_id');

  pgm.createTable('editions', {
    id: 'id',
    date: { type: 'date', notNull: true, unique: true },
  });

  pgm.createTable('articles', {
    id: 'id',
    date: { type: 'date', notNull: true },
    tier: { type: 'integer', notNull: true },
    headline: { type: 'varchar(500)', notNull: true },
    body: { type: 'text', notNull: true },
    related_thread_id: {
      type: 'integer',
      references: '"threads"',
      onDelete: 'SET NULL',
    },
  });
  pgm.createIndex('articles', 'date');
  pgm.createIndex('articles', 'related_thread_id');
};

exports.down = (pgm) => {
  pgm.dropTable('articles');
  pgm.dropTable('editions');
  pgm.dropTable('events');
  pgm.dropTable('messages');
  pgm.dropTable('threads');
  pgm.dropTable('users');
};
