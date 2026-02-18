exports.up = (pgm) => {
  pgm.addColumns('users', {
    telegram_chat_id: { type: 'bigint', unique: true },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['telegram_chat_id']);
};
