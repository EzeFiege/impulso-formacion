export type LessonResource = {
	id: string;
	title: string;
	description: string;
	type: 'code' | 'pdf' | 'template' | 'link';
	size?: string;
	downloadFileName?: string;
	fileContent?: string;
	externalUrl?: string;
};

export function getLessonResources(courseHandle: string, lessonId: string, lessonTitle?: string): LessonResource[] {
	const title = lessonTitle || 'Lección';

	return [
		{
			id: `res-${lessonId}-code`,
			title: `Bloque de Función & Código SCL/Ladder: ${title}`,
			description: 'Archivo de código estructurado listo para importar en Siemens TIA Portal o Rockwell Studio 5000.',
			type: 'code',
			size: '1.2 MB',
			downloadFileName: `bloque_control_${lessonId}.scl`,
			fileContent: `// Impulso Formación - Automatización Industrial & Control OT\n// Código fuente oficial de la clase: ${title}\n// Curso: ${courseHandle}\n\nFUNCTION_BLOCK "FB_Control_Motor"\n{ S7_Optimized_Access := 'TRUE' }\nVERSION : 0.1\n   VAR_INPUT \n      Start : Bool;         // Pulsador de Marcha NO\n      Stop : Bool;          // Pulsador de Parada NC\n      ThermalTrip : Bool;   // Falla por relé térmico o guardamotor NC\n   END_VAR\n\n   VAR_OUTPUT \n      Motor_Run : Bool;     // Salida a bobina del contactor\n      Fault_Alarm : Bool;   // Alarma luminosa de falla\n   END_VAR\n\n   VAR \n      Run_State : Bool;\n   END_VAR\n\nBEGIN\n   // Lógica de marcha/paro con enclavamiento seguro y seguridad positiva\n   IF NOT #Stop OR NOT #ThermalTrip THEN\n      #Run_State := FALSE;\n      #Fault_Alarm := NOT #ThermalTrip;\n   ELSIF #Start AND #Stop AND #ThermalTrip THEN\n      #Run_State := TRUE;\n      #Fault_Alarm := FALSE;\n   END_IF;\n\n   #Motor_Run := #Run_State;\nEND_FUNCTION_BLOCK\n`,
		},
		{
			id: `res-${lessonId}-cheat`,
			title: 'Plano Unifilar, Tabla de Bornes y Guía Técnica (Markdown)',
			description: 'Esquema de conexionado bajo norma IEC 60364, tablas de asignación I/O y datos de placa.',
			type: 'pdf',
			size: '510 KB',
			downloadFileName: `memoria_tecnica_${lessonId}.md`,
			fileContent: `# Memoria Técnica & Guía de Taller · Impulso Formación\n## Clase: ${title}\n\n### Datos de Conexionado y Campo:\n- Tensión de Control: 24 VCC (Fuente conmutada clase 2).\n- Tensión de Potencia: 3x380 VCA + Neutro + Tierra (Esquema TN-S).\n- Conexión del sensor analógico: Transmisor de 2 hilos (4-20 mA) en bornera X1: 1 (+24V), 2 (Señal AI0).\n\n### Protocolo de Comprobación Previo a Energizar:\n1. Verificar apriete de bornes dinámicos con torquímetro (1.2 Nm).\n2. Medición de resistencia de aislamiento fase-tierra (> 100 MΩ).\n3. Comprobar continuidad del lazo de parada de emergencia en bornera de seguridad.\n\n*Equipo de Ingeniería de Impulso Formación.*`,
		},
		{
			id: `res-${lessonId}-repo`,
			title: 'Librería de Automatización Industrial en GitHub',
			description: 'Repositorio abierto con proyectos de ejemplo, simulaciones Factory I/O y UDTs reutilizables.',
			type: 'link',
			externalUrl: 'https://github.com/EzeFiege/impulso-formacion',
		},
		{
			id: `res-${lessonId}-template`,
			title: 'Mapeo de Registros Modbus / Tags Profinet (CSV)',
			description: 'Matriz de asignación de direcciones de memoria, holding registers y tags para HMI y SCADA.',
			type: 'template',
			size: '220 KB',
			downloadFileName: `mapa_tags_${lessonId}.csv`,
			fileContent: `Tag_Name,Address,Data_Type,Description,Scaling\n"Motor1_Speed_SP","%MW100",INT,"Velocidad consigna en RPM","0-1500"\n"Motor1_Current_PV","%IW64",INT,"Corriente absorbida de motor","0-25 A (4-20mA)"\n"Tank_Level_PV","%MD104",REAL,"Nivel de estanque en metros","0.0 - 5.0 m"\n"Emergency_Active","%I0.0",BOOL,"Estado de Parada de Emergencia","0=Paro, 1=OK"\n`,
		},
	];
}

export function downloadMockFile(fileName: string, content: string) {
	const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
