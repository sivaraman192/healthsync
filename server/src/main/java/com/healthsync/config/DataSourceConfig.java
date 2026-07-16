package com.healthsync.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Autowired
    private Environment env;

    @Bean
    public DataSource dataSource() {
        String primaryUrl = env.getProperty("spring.datasource.url");
        String username = env.getProperty("spring.datasource.username", "root");
        String password = env.getProperty("spring.datasource.password", "");
        String driverClassName = env.getProperty("spring.datasource.driver-class-name", "com.mysql.cj.jdbc.Driver");

        log.info("Attempting to connect to primary database: {}", primaryUrl);

        // 1. Try connecting to the primary configured database
        if (primaryUrl != null && primaryUrl.startsWith("jdbc:mysql://")) {
            if (tryMySQLDataSource(primaryUrl, username, password)) {
                log.info("Successfully connected to primary database.");
                return createHikariDataSource(primaryUrl, username, password, driverClassName);
            }
        }

        // 2. If primary fails, check if we can fall back to local MySQL
        log.warn("Primary database connection failed. Attempting to fall back to Local MySQL...");
        String localUrl = "jdbc:mysql://localhost:3306/healthsync?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true";
        String localUsername = "root";
        String localPassword = env.getProperty("spring.datasource.password", "siva@201325"); // use configured password

        if (tryMySQLDataSource(localUrl, localUsername, localPassword)) {
            log.info("Successfully connected to Local MySQL database.");
            return createHikariDataSource(localUrl, localUsername, localPassword, driverClassName);
        }

        // 3. If both MySQL options fail, fallback to H2 in-memory database to prevent startup failure
        log.error("========================================================================");
        log.error("WARNING: DATABASE SERVER IS UNAVAILABLE!");
        log.error("Primary database and Local MySQL (localhost:3306) are both unreachable.");
        log.error("Falling back to in-memory H2 database to ensure successful startup.");
        log.error("========================================================================");

        String h2Url = "jdbc:h2:mem:healthsync;DB_CLOSE_DELAY=-1;MODE=MySQL";
        String h2Username = "sa";
        String h2Password = "";
        String h2Driver = "org.h2.Driver";

        return createHikariDataSource(h2Url, h2Username, h2Password, h2Driver);
    }

    private boolean tryMySQLDataSource(String jdbcUrl, String username, String password) {
        Pattern pattern = Pattern.compile("jdbc:mysql://([^:/]+)(?::(\\d+))?/([^?#\\s]+)");
        Matcher matcher = pattern.matcher(jdbcUrl);

        if (!matcher.find()) {
            return false;
        }

        String host = matcher.group(1);
        String portStr = matcher.group(2);
        int port = (portStr != null) ? Integer.parseInt(portStr) : 3306;
        String dbName = matcher.group(3);

        // Aiven / Cloud DNS & Connection Validation
        try {
            log.info("Validating DNS resolution for host: {}", host);
            InetAddress address = InetAddress.getByName(host);
            log.info("DNS resolved to IP: {}", address.getHostAddress());

            log.info("Validating TCP port connectivity on {}:{}", host, port);
            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress(address, port), 3000); // 3 seconds timeout
                log.info("TCP connectivity check succeeded.");
            }
        } catch (Exception e) {
            log.error("Validation failed for {}:{}. Error: {}", host, port, e.getMessage());
            return false;
        }

        // Try creating the database if it doesn't exist
        try {
            String sslParam = host.contains("aiven") ? "&useSSL=true" : "&useSSL=false";
            String serverUrl = "jdbc:mysql://" + host + ":" + port + "/?allowPublicKeyRetrieval=true" + sslParam;
            
            log.info("Connecting to MySQL server to ensure database '{}' exists...", dbName);
            DriverManager.setLoginTimeout(3);
            try (Connection conn = DriverManager.getConnection(serverUrl, username, password);
                 Statement stmt = conn.createStatement()) {
                stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS " + dbName);
                log.info("Database '{}' checked/created successfully.", dbName);
            }
        } catch (Exception e) {
            log.warn("Could not auto-create database (might exist or insufficient permissions): {}", e.getMessage());
        }

        // Test actual connection
        try {
            DriverManager.setLoginTimeout(3);
            try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password)) {
                return true;
            }
        } catch (Exception e) {
            log.error("JDBC Connection test failed for URL [{}]: {}", jdbcUrl, e.getMessage());
            return false;
        }
    }

    private DataSource createHikariDataSource(String url, String username, String password, String driverClassName) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName(driverClassName);
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setConnectionTimeout(5000);
        return new HikariDataSource(config);
    }
}
