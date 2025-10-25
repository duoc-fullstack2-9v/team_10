function validarFormulario(e) {
    e.preventDefault();

    let nombre = document.getElementById("nombre");
    let correo = document.getElementById("correo");
    let password = document.getElementById("password");
    let confirmar = document.getElementById("confirmar");
    let telefono = document.getElementById("telefono");
    let region = document.getElementById("region");
    let comuna = document.getElementById("comuna");

    let errores = [];

    if (nombre.value.trim() === "") {
        errores.push("El nombre es requerido");
    }
    if (correo.value.trim() === "" || !correo.value.includes("@")) {
        errores.push("Correo inválido");
    }
    if (password.value.length < 6) {
        errores.push("La contraseña debe tener al menos 6 caracteres");
    }
    if (password.value !== confirmar.value) {
        errores.push("Las contraseñas no coinciden");
    }
    const telefonoVal = telefono.value.trim();
    if (telefonoVal === "") {
        errores.push("El teléfono es requerido");
    } else if (!/^\+?56\d{9}$/.test(telefonoVal.replace(/\s+/g, ""))) {
        errores.push("El teléfono debe ser chileno, ejemplo: +56912345678 o 56912345678");
    }
    if (region.value === "") {
        errores.push("Seleccione una región");
    }
    if (comuna.value === "") {
        errores.push("Seleccione una comuna");
    }

    if (errores.length > 0) {
        alert(errores.join("\n"));
    } else {
        document.getElementById("formulario").submit();
    }
}

const comunasPorRegion = {
    arica: ["Arica", "Camarones", "Putre", "General Lagos"],
    tarapaca: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    antofagasta: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    atacama: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Huasco", "Freirina", "Alto del Carmen"],
    coquimbo: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    valparaiso: ["Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví", "Quilpué", "Villa Alemana", "Limache", "Olmué", "Casablanca", "Juan Fernández", "San Antonio", "Cartagena", "El Tabo", "El Quisco", "Algarrobo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Los Andes", "Calle Larga", "Rinconada", "San Esteban"],
    ohiggins: ["Rancagua", "Machalí", "Graneros", "Mostazal", "Codegua", "Rengo", "Malloa", "Requínoa", "Olivar", "Doñihue", "Coltauco", "Coinco", "Quinta de Tilcoco", "San Vicente", "Peumo", "Pichidegua", "Las Cabras", "Cachapoal", "Pichilemu", "Marchigüe", "Navidad", "La Estrella", "Litueche", "Palmilla", "Peralillo", "Placilla", "Nancagua", "Chépica", "Santa Cruz", "Lolol", "Pumanque"],
    maule: ["Talca", "San Clemente", "Pelarco", "Pencahue", "Maule", "San Rafael", "Curepto", "Constitución", "Empedrado", "Río Claro", "Colbún", "Linares", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas", "Cauquenes", "Chanco", "Pelluhue"],
    nuble: ["Chillán", "Chillán Viejo", "Bulnes", "Quillón", "San Ignacio", "El Carmen", "Pemuco", "Yungay", "Quirihue", "Cobquecura", "Ninhue", "Treguaco", "San Carlos", "San Nicolás", "Ñiquén", "Coihueco", "San Fabián", "Pincheira"],
    biobio: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
    araucania: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Angol", "Collipulli", "Ercilla", "Lonquimay", "Los Sauces", "Purén", "Renaico", "Traiguén", "Victoria"],
    losrios: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    loslagos: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo"],
    aysen: ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Río Ibáñez", "Chile Chico", "Cochrane", "O'Higgins", "Tortel"],
    magallanes: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"],
    metropolitana: ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura", "Pirque", "San Bernardo", "Calera de Tango", "Buin", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
};

document.addEventListener("DOMContentLoaded", function() {
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");

    regionSelect.addEventListener("change", function() {
        const region = regionSelect.value;
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
        if (comunasPorRegion[region]) {
            comunasPorRegion[region].forEach(comuna => {
                const option = document.createElement("option");
                option.value = comuna.toLowerCase().replace(/\s/g, "_");
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        }
    });
});

// Filtro de productos por categoría
document.addEventListener("DOMContentLoaded", function() {
    const filtro = document.getElementById('filtro-categoria');
    if (filtro) {
        filtro.addEventListener('change', function() {
            const valor = this.value;
            document.querySelectorAll('.product-card').forEach(card => {
                if (valor === 'todas' || card.dataset.categoria === valor) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});