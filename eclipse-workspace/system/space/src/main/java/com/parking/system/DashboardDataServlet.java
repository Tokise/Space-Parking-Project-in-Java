package com.parking.system;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/dashboard-data")
public class DashboardDataServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final int TOTAL_PARKING_SLOTS = 100; // Example total slots

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/user_data", "root", "W7301@jqir#");

            // Query to count online clients
            stmt = conn.prepareStatement("SELECT COUNT(*) AS online_count FROM users WHERE end_time IS NULL");
            rs = stmt.executeQuery();
            int onlineCount = rs.next() ? rs.getInt("online_count") : 0;

            // Query to count completed clients
            stmt = conn.prepareStatement("SELECT COUNT(*) AS completed_count FROM out_clients");
            rs = stmt.executeQuery();
            int completedCount = rs.next() ? rs.getInt("completed_count") : 0;

            // Query to sum total revenue
            stmt = conn.prepareStatement("SELECT COALESCE(SUM(payment), 0) AS total_revenue FROM out_clients");
            rs = stmt.executeQuery();
            double totalRevenue = 0; // Change to double
            if (rs.next()) {
                totalRevenue = rs.getDouble("total_revenue"); // Retrieve as double
            }

            // Query to count unpaid clients
            stmt = conn.prepareStatement("SELECT COUNT(*) AS unpaid_client FROM completed_parking_records WHERE payment IS NULL");
            rs = stmt.executeQuery();
            int unpaidClient = 0; 
            if (rs.next()) {
                unpaidClient = rs.getInt("unpaid_client"); // Correctly retrieve unpaid clients count
            }

            // Calculate available slots
            int availableSlots = TOTAL_PARKING_SLOTS - onlineCount;

            // Query to get occupied slots
            stmt = conn.prepareStatement("SELECT parking_slot FROM users WHERE end_time IS NULL");
            rs = stmt.executeQuery();
            StringBuilder occupiedSlots = new StringBuilder();
            while (rs.next()) {
                if (occupiedSlots.length() > 0) {
                    occupiedSlots.append(",");
                }
                occupiedSlots.append("\"").append(rs.getString("parking_slot")).append("\"");
            }

            // Create a JSON object to send back the counts and available slots
            String jsonResponse = String.format(
                "{\"online_count\": %d, \"completed_count\": %d, \"available_slots\": %d, \"occupied_slots\": [%s], \"total_revenue\": %.2f, \"unpaid_client\": %d}", 
                onlineCount, completedCount, availableSlots, occupiedSlots.toString(), totalRevenue , unpaidClient // Use %.2f for formatting double
            );
            response.getWriter().write(jsonResponse);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Unable to retrieve data: " + e.getMessage() + "\"}");
        } finally {
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
