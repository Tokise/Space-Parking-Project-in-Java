package com.parking.system;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/user-data")
public class AddClient extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String DB_URL = "jdbc:mysql://localhost:3306/user_data";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "W7301@jqir#";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONArray userList = new JSONArray();

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT id, license_plate, client_name, client_type, vehicle_type, client_age, contact_number, parking_slot, start_time, end_time " +
                             "FROM users WHERE end_time IS NULL")) {
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject user = new JSONObject();
                user.put("id", rs.getInt("id"));
                user.put("license_plate", rs.getString("license_plate"));
                user.put("client_name", rs.getString("client_name"));
                user.put("client_type", rs.getString("client_type"));
                user.put("vehicle_type", rs.getString("vehicle_type"));
                user.put("client_age", rs.getInt("client_age"));
                user.put("contact_number", rs.getString("contact_number"));
                user.put("parking_slot", rs.getString("parking_slot"));

                // Handle null timestamps
                user.put("start_time", getFormattedTimestamp(rs.getTimestamp("start_time")));
                user.put("end_time", getFormattedTimestamp(rs.getTimestamp("end_time")));

                userList.put(user);
            }

            response.getWriter().print(userList.toString());

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String paymentAmountParam = request.getParameter("payment");
        String clientIdParam = request.getParameter("id");

        try (Connection conn = getConnection()) {
            // Handle payment update if present
            if (clientIdParam != null && paymentAmountParam != null) {
                updatePayment(conn, clientIdParam, paymentAmountParam, response);
                return;
            }

            // Handle client data insertion
            insertClientData(conn, request, response);

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error recording data.");
        }
    }

    private Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    private String getFormattedTimestamp(Timestamp timestamp) {
        return (timestamp != null) ? timestamp.toString() : "Not Started";
    }

    private void updatePayment(Connection conn, String clientIdParam, String paymentAmountParam, HttpServletResponse response) throws SQLException, IOException {
        int clientId = Integer.parseInt(clientIdParam);
        double payment = Double.parseDouble(paymentAmountParam);

        System.out.println("Updating payment for ID: " + clientId + " with payment: " + payment);

        // Update payment in completed_parking_records
        String sqlUpdate = "UPDATE completed_parking_records SET payment = ? WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sqlUpdate)) {
            stmt.setDouble(1, payment);
            stmt.setInt(2, clientId);

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                deleteCompletedParkingRecord(conn, clientId);
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("Payment updated successfully.");
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("No record found for the given client ID.");
            }
        }
    }

    private void deleteCompletedParkingRecord(Connection conn, int clientId) throws SQLException {
        String sqlDelete = "DELETE FROM completed_parking_records WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sqlDelete)) {
            stmt.setInt(1, clientId);
            stmt.executeUpdate(); // Execute delete
        }
    }

    private void insertClientData(Connection conn, HttpServletRequest request, HttpServletResponse response) throws SQLException, IOException {
        String licensePlate = request.getParameter("license_plate");
        String clientName = request.getParameter("client_name");
        String clientType = request.getParameter("client_type");
        String vehicleType = request.getParameter("vehicle_type");
        String clientAge = request.getParameter("client_age");
        String contactNumber = request.getParameter("contact_number");
        String selectedSlot = request.getParameter("parking_slot");

        String sqlInsert = "INSERT INTO users (license_plate, client_name, client_type, vehicle_type, client_age, contact_number, parking_slot, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sqlInsert)) {
            stmt.setString(1, licensePlate);
            stmt.setString(2, clientName);
            stmt.setString(3, clientType);
            stmt.setString(4, vehicleType);
            stmt.setString(5, clientAge);
            stmt.setString(6, contactNumber);
            stmt.setString(7, selectedSlot);
            stmt.setTimestamp(8, new Timestamp(new Date().getTime()));
            stmt.setTimestamp(9, null);

            stmt.executeUpdate();
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("Client data recorded successfully.");
            response.sendRedirect("index.jsp");
        }
    }
}
