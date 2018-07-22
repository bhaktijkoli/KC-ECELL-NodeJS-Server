require('dotenv').config()

let CONFIG = {}

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mongo';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '27017';
CONFIG.db_name = process.env.DB_NAME || 'attendance_system';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || 'toor';

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_attendance_system';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '1 day';

module.exports = CONFIG;