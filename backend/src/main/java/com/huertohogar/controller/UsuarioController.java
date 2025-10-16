package com.huertohogar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UsuarioController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Clase interna para mapear los resultados de la consulta
    private static class UsuarioRowMapper implements RowMapper<Map<String, Object>> {
        @Override
        public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
            Map<String, Object> usuario = new HashMap<>();
            usuario.put("idUsuario", rs.getInt("id_usuario"));
            usuario.put("nombre", rs.getString("nombre"));
            usuario.put("apellido", ""); // No existe en la BD, campo vacío
            usuario.put("email", rs.getString("email"));
            usuario.put("password", rs.getString("password"));
            usuario.put("telefono", rs.getLong("telefono"));
            usuario.put("direccion", rs.getString("direccion"));
            usuario.put("idTipoUsuario", rs.getInt("id_tipo_usuario"));
            usuario.put("estaActivo", "Y"); // Asumimos que están activos por defecto
            return usuario;
        }
    }

    // ==================== OBTENER TODOS LOS USUARIOS ====================
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> obtenerTodosLosUsuarios() {
        try {
            String sql = "SELECT id_usuario, nombre, email, password, telefono, " +
                        "direccion, id_tipo_usuario " +
                        "FROM usuario " +
                        "ORDER BY nombre ASC";
            
            List<Map<String, Object>> usuarios = jdbcTemplate.query(sql, new UsuarioRowMapper());
            
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== OBTENER USUARIO POR ID ====================
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerUsuarioPorId(@PathVariable String id) {
        try {
            String sql = "SELECT id_usuario, nombre, email, password, telefono, " +
                        "direccion, id_tipo_usuario " +
                        "FROM usuario WHERE id_usuario = ?";
            
            Map<String, Object> usuario = jdbcTemplate.queryForObject(sql, new UsuarioRowMapper(), id);
            
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== CREAR NUEVO USUARIO ====================
    @PostMapping
    public ResponseEntity<String> crearUsuario(@RequestBody Map<String, Object> usuario) {
        try {
            // Validar datos requeridos
            if (!usuario.containsKey("idUsuario") || usuario.get("idUsuario") == null ||
                !usuario.containsKey("nombre") || usuario.get("nombre") == null ||
                !usuario.containsKey("email") || usuario.get("email") == null ||
                !usuario.containsKey("password") || usuario.get("password") == null) {
                return ResponseEntity.badRequest().body("Faltan campos obligatorios");
            }

            // Verificar si ya existe un usuario con ese ID o email
            String checkSql = "SELECT COUNT(*) FROM usuario WHERE id_usuario = ? OR email = ?";
            int count = jdbcTemplate.queryForObject(checkSql, Integer.class, 
                usuario.get("idUsuario"), usuario.get("email"));
            if (count > 0) {
                return ResponseEntity.badRequest().body("Ya existe un usuario con ese ID o email");
            }

            String sql = "INSERT INTO usuario (id_usuario, nombre, apellido, email, password, " +
                        "telefono, direccion, id_tipo_usuario, esta_activo, fecha_creacion) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE)";
            
            int filasAfectadas = jdbcTemplate.update(sql,
                usuario.get("idUsuario"),
                usuario.get("nombre"),
                usuario.get("apellido"),
                usuario.get("email"),
                usuario.get("password"),
                usuario.get("telefono"),
                usuario.get("direccion"),
                usuario.get("idTipoUsuario"),
                usuario.getOrDefault("estaActivo", "Y")
            );

            if (filasAfectadas > 0) {
                return ResponseEntity.ok("Usuario creado exitosamente");
            } else {
                return ResponseEntity.internalServerError().body("Error al crear el usuario");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    // ==================== ACTUALIZAR USUARIO ====================
    @PutMapping
    public ResponseEntity<String> actualizarUsuario(@RequestBody Map<String, Object> usuario) {
        try {
            // Validar que el ID del usuario esté presente
            if (!usuario.containsKey("idUsuario") || usuario.get("idUsuario") == null) {
                return ResponseEntity.badRequest().body("ID del usuario es requerido");
            }

            // Verificar si el usuario existe
            String checkSql = "SELECT COUNT(*) FROM usuario WHERE id_usuario = ?";
            int count = jdbcTemplate.queryForObject(checkSql, Integer.class, usuario.get("idUsuario"));
            if (count == 0) {
                return ResponseEntity.notFound().build();
            }

            String sql = "UPDATE usuario SET " +
                        "nombre = ?, apellido = ?, email = ?, password = ?, " +
                        "telefono = ?, direccion = ?, id_tipo_usuario = ?, esta_activo = ?, " +
                        "fecha_modificacion = SYSDATE " +
                        "WHERE id_usuario = ?";
            
            int filasAfectadas = jdbcTemplate.update(sql,
                usuario.get("nombre"),
                usuario.get("apellido"),
                usuario.get("email"),
                usuario.get("password"),
                usuario.get("telefono"),
                usuario.get("direccion"),
                usuario.get("idTipoUsuario"),
                usuario.getOrDefault("estaActivo", "Y"),
                usuario.get("idUsuario")
            );

            if (filasAfectadas > 0) {
                return ResponseEntity.ok("Usuario actualizado exitosamente");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    // ==================== ELIMINAR USUARIO ====================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable String id) {
        try {
            // Verificar si el usuario existe
            String checkSql = "SELECT COUNT(*) FROM usuario WHERE id_usuario = ?";
            int count = jdbcTemplate.queryForObject(checkSql, Integer.class, id);
            if (count == 0) {
                return ResponseEntity.notFound().build();
            }

            // En lugar de eliminar completamente, marcar como inactivo
            String updateSql = "UPDATE usuario SET esta_activo = 'N', fecha_modificacion = SYSDATE WHERE id_usuario = ?";
            int filasAfectadas = jdbcTemplate.update(updateSql, id);
            
            if (filasAfectadas > 0) {
                return ResponseEntity.ok("Usuario desactivado exitosamente");
            } else {
                return ResponseEntity.internalServerError().body("Error al desactivar el usuario");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    // ==================== BUSCAR USUARIOS ====================
    @GetMapping("/buscar")
    public ResponseEntity<List<Map<String, Object>>> buscarUsuarios(@RequestParam String termino) {
        try {
            String sql = "SELECT id_usuario, nombre, apellido, email, password, telefono, " +
                        "direccion, id_tipo_usuario, esta_activo " +
                        "FROM usuario " +
                        "WHERE UPPER(nombre) LIKE UPPER(?) OR UPPER(apellido) LIKE UPPER(?) OR UPPER(email) LIKE UPPER(?) " +
                        "ORDER BY nombre ASC";
            
            String terminoBusqueda = "%" + termino + "%";
            List<Map<String, Object>> usuarios = jdbcTemplate.query(sql, new UsuarioRowMapper(), 
                                                                   terminoBusqueda, terminoBusqueda, terminoBusqueda);
            
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== OBTENER USUARIOS POR TIPO ====================
    @GetMapping("/tipo/{tipoId}")
    public ResponseEntity<List<Map<String, Object>>> obtenerUsuariosPorTipo(@PathVariable int tipoId) {
        try {
            String sql = "SELECT id_usuario, nombre, apellido, email, password, telefono, " +
                        "direccion, id_tipo_usuario, esta_activo " +
                        "FROM usuario " +
                        "WHERE id_tipo_usuario = ? AND esta_activo = 'Y' " +
                        "ORDER BY nombre ASC";
            
            List<Map<String, Object>> usuarios = jdbcTemplate.query(sql, new UsuarioRowMapper(), tipoId);
            
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}