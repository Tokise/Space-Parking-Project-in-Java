package com.parking.system;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/stop-time")
public class StopTimeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String clientId = request.getParameter("client_id");

        Connection conn = null;
        PreparedStatement stmt = null;
        PreparedStatement transferStmt = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/user_data", "root", "W7301@jqir#");

            // Step 1: Stop the time and calculate the fee
            String sql = "UPDATE users SET end_time = ?, parking_fee = ? WHERE id = ?";
            stmt = conn.prepareStatement(sql);

            // Set end time to current timestamp
            Timestamp endTime = new Timestamp(new Date().getTime());
            stmt.setTimestamp(1, endTime);

            // Fetch the start time to calculate the parking fee
            String startTimeSql = "SELECT start_time FROM users WHERE id = ?";
            PreparedStatement startStmt = conn.prepareStatement(startTimeSql);
            startStmt.setString(1, clientId);
            ResultSet rs = startStmt.executeQuery();
            Timestamp startTime = null;
            if (rs.next()) {
                startTime = rs.getTimestamp("start_time");
            }

            double parkingFee = calculateParkingFee(startTime, endTime);

            // Set the parking fee in the update statement
            stmt.setDouble(2, parkingFee);
            stmt.setString(3, clientId);

            int rowsUpdated = stmt.executeUpdate();

            // Step 2: If update successful, transfer the record to the completed parking records
            if (rowsUpdated > 0) {
                String transferSql = "INSERT INTO completed_parking_records (id, license_plate, client_name, client_type, vehicle_type, client_age, contact_number, parking_slot, start_time, end_time, parking_fee, duration) "
                                   + "SELECT id, license_plate, client_name, client_type, vehicle_type, client_age, contact_number, parking_slot, start_time, end_time, parking_fee, TIMESTAMPDIFF(MINUTE, start_time, end_time) AS duration FROM users WHERE id = ?";
                transferStmt = conn.prepareStatement(transferSql);
                transferStmt.setString(1, clientId);
                int rowsTransferred = transferStmt.executeUpdate();

                if (rowsTransferred > 0) {
                    // If record transferred, delete the record from the active users table
                    String deleteSql = "DELETE FROM users WHERE id = ?";
                    PreparedStatement deleteStmt = conn.prepareStatement(deleteSql);
                    deleteStmt.setString(1, clientId);
                    deleteStmt.executeUpdate();
                }
            }

            // Respond with success status
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().print("{\"success\": true}");

        } catch (Exception e) {
            e.printStackTrace();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().print("{\"success\": false, \"message\": \"" + e.getMessage() + "\"}");
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private double calculateParkingFee(Timestamp startTime, Timestamp endTime) {
        final double ratePerHour = 50; // Rate in Philippine Pesos
        long durationMillis = endTime.getTime() - startTime.getTime();
        double durationHours = (double) durationMillis / (1000 * 60 * 60);
        return Math.round(durationHours * ratePerHour * 100.0) / 100.0;
    }
}
