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
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ProductoController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Clase interna para mapear los resultados de la consulta
    private static class ProductoRowMapper implements RowMapper<Map<String, Object>> {
        @Override
        public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
            Map<String, Object> producto = new HashMap<>();
            producto.put("idProducto", rs.getString("id_producto"));
            producto.put("nombre", rs.getString("nombre"));
            producto.put("descripcion", rs.getString("descripcion"));
            producto.put("precio", rs.getDouble("precio"));
            producto.put("stock", rs.getInt("stock"));
            producto.put("stockMinimo", rs.getInt("stock_minimo"));
            producto.put("idCategoria", rs.getString("id_categoria"));
            producto.put("estaActivo", rs.getString("esta_activo"));
            producto.put("imagen", rs.getString("imagen"));
            return producto;
        }
    }

    // ==================== OBTENER TODOS LOS PRODUCTOS ====================
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> obtenerTodosLosProductos() {
        try {
            String sql = "SELECT id_producto, nombre, descripcion, precio, stock, " +
                        "stock_minimo, id_categoria, esta_activo, imagen " +
                        "FROM producto " +
                        "ORDER BY nombre ASC";
            
            List<Map<String, Object>> productos = jdbcTemplate.query(sql, new ProductoRowMapper());
            
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== OBTENER PRODUCTO POR ID ====================
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerProductoPorId(@PathVariable String id) {
        try {
            String sql = "SELECT id_producto, nombre, descripcion, precio, stock, " +
                        "stock_minimo, id_categoria, esta_activo, imagen " +
                        "FROM producto WHERE id_producto = ?";
            
            Map<String, Object> producto = jdbcTemplate.queryForObject(sql, new ProductoRowMapper(), id);
            
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== CREAR NUEVO PRODUCTO ====================
    @PostMapping
    public ResponseEntity<String> crearProducto(@RequestBody Map<String, Object> producto) {
        try {
            // Validar datos requeridos
            if (!producto.containsKey("idProducto") || producto.get("idProducto") == null ||
                !producto.containsKey("nombre") || producto.get("nombre") == null ||
                !producto.containsKey("precio") || producto.get("precio") == null ||
                !producto.containsKey("stock") || producto.get("stock") == null) {
                return ResponseEntity.badRequest().body("Faltan campos obligatorios");
            }

            // Verificar si ya existe un producto con ese ID
            String checkSql = "SELECT COUNT(*) FROM producto WHERE id_producto = ?";
            int count = jdbcTemplate.queryForObject(checkSql, Integer.class, producto.get("idProducto"));
            if (count > 0) {
                return ResponseEntity.badRequest().body("Ya existe un producto con ese ID");
            }

            String sql = "INSERT INTO producto (id_producto, nombre, descripcion, precio, stock, " +
                        "stock_minimo, id_categoria, esta_activo, imagen, fecha_creacion) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE)";
            
            int filasAfectadas = jdbcTemplate.update(sql,
                producto.get("idProducto"),
                producto.get("nombre"),
                producto.get("descripcion"),
                ((Number) producto.get("precio")).doubleValue(),
                ((Number) producto.get("stock")).intValue(),
                producto.containsKey("stockMinimo") ? ((Number) producto.get("stockMinimo")).intValue() : 5,
                producto.get("idCategoria"),
                producto.getOrDefault("estaActivo", "Y"),
                producto.get("imagen")
            );

            if (filasAfectadas > 0) {
                return ResponseEntity.ok("Producto creado exitosamente");
            } else {
                return ResponseEntity.internalServerError().body("Error al crear el producto");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    // ==================== ACTUALIZAR PRODUCTO ====================
    @PutMapping
    public ResponseEntity<String> actualizarProducto(@RequestBody Map<String, Object> producto) {
        try {
            // Validar que el ID del producto esté presente
            if (!producto.containsKey("idProducto") || producto.get("idProducto") == null) {
                return ResponseEntity.badRequest().body("ID del producto es requerido");
            }

            // Verificar si el producto existe
            String checkSql = "SELECT COUNT(*) FROM producto WHERE id_producto = ?";
            int count = jdbcTemplate.queryForObject(checkSql, Integer.class, producto.get("idProducto"));
            if (count == 0) {
                return ResponseEntity.notFound().build();
            }

            String sql = "UPDATE producto SET " +
                        "nombre = ?, descripcion = ?, precio = ?, stock = ?, " +
                        "stock_minimo = ?, id_categoria = ?, esta_activo = ?, imagen = ?, " +
                        "fecha_modificacion = SYSDATE " +
                        "WHERE id_producto = ?";
            
            int filasAfectadas = jdbcTemplate.update(sql,
                producto.get("nombre"),
                producto.get("descripcion"),
                ((Number) producto.get("precio")).doubleValue(),
                ((Number) producto.get("stock")).intValue(),
                producto.containsKey("stockMinimo") ? ((Number) producto.get("stockMinimo")).intValue() : 5,
                producto.get("idCategoria"),
                producto.getOrDefault("estaActivo", "Y"),
                producto.get("imagen"),
                producto.get("idProducto")
            );

            if (filasAfectadas > 0) {
                return ResponseEntity.ok("Producto actualizado exitosamente");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    // ==================== ELIMINAR PRODUCTO ====================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarProducto(@PathVariable String id) {
        try {
            // Verificar si el producto existe
            String checkSql = "SELECT COUNT(*) FROM producto WHERE id_producto = ?";
            int count = jdbcTemplate.queryForObject(checkSql, Integer.class, id);
            if (count == 0) {
                return ResponseEntity.notFound().build();
            }

            // Verificar si el producto está siendo utilizado en pedidos
            String pedidosSql = "SELECT COUNT(*) FROM detalle_pedido WHERE id_producto = ?";
            int pedidosCount = jdbcTemplate.queryForObject(pedidosSql, Integer.class, id);
            
            if (pedidosCount > 0) {
                // Si tiene pedidos asociados, solo marcarlo como inactivo
                String updateSql = "UPDATE producto SET esta_activo = 'N', fecha_modificacion = SYSDATE WHERE id_producto = ?";
                jdbcTemplate.update(updateSql, id);
                return ResponseEntity.ok("Producto desactivado (tenía pedidos asociados)");
            } else {
                // Si no tiene pedidos, eliminar completamente
                String deleteSql = "DELETE FROM producto WHERE id_producto = ?";
                int filasAfectadas = jdbcTemplate.update(deleteSql, id);
                
                if (filasAfectadas > 0) {
                    return ResponseEntity.ok("Producto eliminado exitosamente");
                } else {
                    return ResponseEntity.internalServerError().body("Error al eliminar el producto");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    // ==================== BUSCAR PRODUCTOS ====================
    @GetMapping("/buscar")
    public ResponseEntity<List<Map<String, Object>>> buscarProductos(@RequestParam String termino) {
        try {
            String sql = "SELECT id_producto, nombre, descripcion, precio, stock, " +
                        "stock_minimo, id_categoria, esta_activo, imagen " +
                        "FROM producto " +
                        "WHERE UPPER(nombre) LIKE UPPER(?) OR UPPER(descripcion) LIKE UPPER(?) " +
                        "ORDER BY nombre ASC";
            
            String terminoBusqueda = "%" + termino + "%";
            List<Map<String, Object>> productos = jdbcTemplate.query(sql, new ProductoRowMapper(), 
                                                                   terminoBusqueda, terminoBusqueda);
            
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== OBTENER PRODUCTOS POR CATEGORÍA ====================
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Map<String, Object>>> obtenerProductosPorCategoria(@PathVariable String categoriaId) {
        try {
            String sql = "SELECT id_producto, nombre, descripcion, precio, stock, " +
                        "stock_minimo, id_categoria, esta_activo, imagen " +
                        "FROM producto " +
                        "WHERE id_categoria = ? AND esta_activo = 'Y' " +
                        "ORDER BY nombre ASC";
            
            List<Map<String, Object>> productos = jdbcTemplate.query(sql, new ProductoRowMapper(), categoriaId);
            
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== OBTENER PRODUCTOS CON STOCK BAJO ====================
    @GetMapping("/stock-bajo")
    public ResponseEntity<List<Map<String, Object>>> obtenerProductosStockBajo() {
        try {
            String sql = "SELECT id_producto, nombre, descripcion, precio, stock, " +
                        "stock_minimo, id_categoria, esta_activo, imagen " +
                        "FROM producto " +
                        "WHERE stock <= stock_minimo AND esta_activo = 'Y' " +
                        "ORDER BY (stock - stock_minimo) ASC, nombre ASC";
            
            List<Map<String, Object>> productos = jdbcTemplate.query(sql, new ProductoRowMapper());
            
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== ACTUALIZAR STOCK DE PRODUCTO ====================
    @PatchMapping("/{id}/stock")
    public ResponseEntity<String> actualizarStock(@PathVariable String id, @RequestBody Map<String, Object> stockData) {
        try {
            if (!stockData.containsKey("nuevoStock")) {
                return ResponseEntity.badRequest().body("Campo 'nuevoStock' es requerido");
            }

            String sql = "UPDATE producto SET stock = ?, fecha_modificacion = SYSDATE WHERE id_producto = ?";
            int nuevoStock = ((Number) stockData.get("nuevoStock")).intValue();
            
            int filasAfectadas = jdbcTemplate.update(sql, nuevoStock, id);
            
            if (filasAfectadas > 0) {
                return ResponseEntity.ok("Stock actualizado exitosamente");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }
}