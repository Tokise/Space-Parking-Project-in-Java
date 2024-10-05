package com.parking.system;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Servlet implementation class Login
 */

@WebServlet("/login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String uemail = request.getParameter("username");
		String upass = request.getParameter("password");
		RequestDispatcher dispatcher = null;
		HttpSession session = request.getSession();
	
			try {
				Class.forName("com.mysql.cj.jdbc.Driver");
				 Connection con =DriverManager.getConnection("jdbc:mysql://localhost:3306/user_admin?useSSL=false", "root", "W7301@jqir#");
				PreparedStatement pst =con.prepareStatement("select * from users where uemail = ? and upass = ?");
				
				pst.setString(1, uemail);
				pst.setString(2, upass);
	
				
				ResultSet rs =pst.executeQuery();
				if(rs.next()) {
					session.setAttribute("name",rs.getString("uname"));
					dispatcher = request.getRequestDispatcher("index.jsp");
				}else {
					request.setAttribute("status", "failed");
					dispatcher = request.getRequestDispatcher("login.jsp");

				}
				
				dispatcher.forward(request, response);
			}catch (Exception e){
				e.printStackTrace();
			}
		
		
	}

}
