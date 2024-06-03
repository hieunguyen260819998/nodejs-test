const ngrok = require('ngrok');
const mysql = require('mysql');

// MySQL database configuration
const dbConfig = {
    host: 'localhost',  // Địa chỉ localhost của Laragon
    user: 'root',       // Người dùng MySQL
    password: 'admin@123', // Mật khẩu MySQL
    port: 3306,         // Cổng MySQL, trong trường hợp này là 3306
    database: 'node_test' // Tên cơ sở dữ liệu
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');

    // Kết nối thành công, bắt đầu khởi động ngrok
    ngrok.connect({
        proto: 'tcp',
        addr: dbConfig.host + ':' + dbConfig.port 
    }).then((url) => {
        console.log('ngrok tunnel:', url);

        // Tại đây bạn có thể sử dụng `url` để kết nối với ứng dụng của bạn hoặc thực hiện các thử nghiệm

    }).catch((err) => {
        console.error('Error starting ngrok:', err);
        connection.end(); // Đóng kết nối MySQL khi có lỗi ngrok
    });
});

// Xử lý thoát quy trình
process.on('SIGINT', () => {
    console.log('Closing ngrok and MySQL connections');
    ngrok.disconnect();
    connection.end();
    process.exit();
});
