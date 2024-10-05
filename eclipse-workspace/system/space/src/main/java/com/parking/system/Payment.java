package com.parking.system;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.json.JSONArray;
import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/payment-list")
public class Payment extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	 response.setContentType("text/html; charset=UTF-8");
    	response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        JSONArray clientArray = new JSONArray();

        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/user_data", "root", "W7301@jqir#");
             PreparedStatement stmt = conn.prepareStatement("SELECT id, license_plate, client_name, client_type, vehicle_type, client_age, contact_number, parking_slot, start_time, end_time, duration, parking_fee FROM completed_parking_records");
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                JSONObject clientJson = new JSONObject();
                clientJson.put("id", rs.getInt("id"));
                clientJson.put("license_plate", rs.getString("license_plate"));
                clientJson.put("client_name", rs.getString("client_name"));
                clientJson.put("client_type", rs.getString("client_type"));
                clientJson.put("client_age", rs.getInt("client_age"));
                clientJson.put("vehicle_type", rs.getString("vehicle_type"));
                clientJson.put("contact_number", rs.getString("contact_number"));
                clientJson.put("parking_slot", rs.getString("parking_slot"));
                clientJson.put("start_time", rs.getTimestamp("start_time").toString());
                clientJson.put("end_time", rs.getTimestamp("end_time") != null ? rs.getTimestamp("end_time").toString() : null);
                clientJson.put("duration", rs.getLong("duration"));
                clientJson.put("parking_fee", rs.getDouble("parking_fee"));

                clientArray.put(clientJson);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Database access error", e);
        }

        out.print(clientArray);
        out.flush();
    }
}
