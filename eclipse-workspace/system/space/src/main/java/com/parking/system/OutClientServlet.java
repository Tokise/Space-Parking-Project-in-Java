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

@WebServlet("/out-client-data")
public class OutClientServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");  // Correct content type for JSON
        response.setCharacterEncoding("UTF-8");      // Ensure UTF-8 encoding
        PrintWriter out = response.getWriter();

        JSONArray outClientArray = new JSONArray();

        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/user_data", "root", "W7301@jqir#");
             PreparedStatement stmt = conn.prepareStatement("SELECT id, license_plate, client_name, parking_slot, start_time, end_time, parking_fee, payment_status FROM out_clients");
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                JSONObject outClientJson = new JSONObject();
                outClientJson.put("id", rs.getInt("id"));
                outClientJson.put("license_plate", rs.getString("license_plate"));
                outClientJson.put("client_name", rs.getString("client_name"));
                outClientJson.put("parking_slot", rs.getString("parking_slot"));
                outClientJson.put("start_time", rs.getTimestamp("start_time") != null ? rs.getTimestamp("start_time").toString() : null);
                outClientJson.put("end_time", rs.getTimestamp("end_time") != null ? rs.getTimestamp("end_time").toString() : null);
                outClientJson.put("parking_fee", rs.getDouble("parking_fee"));
                outClientJson.put("payment", rs.getString("payment_status"));

                outClientArray.put(outClientJson);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new ServletException("Database access error", e);
        }

        out.print(outClientArray);  // Send JSON data to the client
        out.flush();
    }
}
