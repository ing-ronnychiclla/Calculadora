   // Variable para almacenar la expresión matemática actual
        let currentInput = '';
        
        // Variable para determinar si se debe limpiar la pantalla en la próxima entrada
        let shouldClear = false;

        // Función para agregar caracteres a la pantalla
        function appendToDisplay(value) {
            const display = document.getElementById('display');
            
            // Si se debe limpiar (después de un cálculo), reinicia
            if (shouldClear) {
                currentInput = '';
                shouldClear = false;
            }
            
            // Si la pantalla muestra solo "0", reemplaza con el nuevo valor
            if (currentInput === '' && value !== '.') {
                currentInput = value;
            } else {
                // Agrega el valor a la expresión actual
                currentInput += value;
            }
            
            // Actualiza la pantalla con formato mejorado
            display.textContent = formatDisplay(currentInput);
        }

        // Función para formatear la visualización en pantalla
        function formatDisplay(input) {
            // Reemplaza operadores matemáticos con símbolos más legibles
            return input
                .replace(/\*/g, '×')
                .replace(/Math\.PI/g, 'π')
                .replace(/Math\.E/g, 'e')
                .replace(/Math\./g, '');
        }

        // Función para limpiar completamente la pantalla
        function clearDisplay() {
            currentInput = '';
            document.getElementById('display').textContent = '0';
            shouldClear = false;
        }

        // Función principal para realizar cálculos
        function calculate() {
            try {
                const display = document.getElementById('display');
                
                // Si no hay entrada, no hace nada
                if (currentInput === '') return;
                
                // Prepara la expresión para evaluación
                let expression = prepareExpression(currentInput);
                
                // Evalúa la expresión matemática
                let result = eval(expression);
                
                // Maneja casos especiales de resultado
                if (!isFinite(result)) {
                    throw new Error('Resultado inválido');
                }
                
                // Redondea el resultado para evitar errores de punto flotante
                result = Math.round(result * 1000000000000) / 1000000000000;
                
                // Actualiza la pantalla y variables
                display.textContent = result.toString();
                currentInput = result.toString();
                shouldClear = true;
                
            } catch (error) {
                // Maneja errores mostrando "Error" en pantalla
                document.getElementById('display').textContent = 'Error';
                currentInput = '';
                shouldClear = true;
            }
        }

        // Función para preparar la expresión antes de evaluarla
        function prepareExpression(input) {
            // Reemplaza constantes matemáticas y operadores
            return input
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                // Maneja funciones trigonométricas que requieren conversión de grados a radianes
                .replace(/sin\(/g, 'Math.sin(degToRad(')
                .replace(/cos\(/g, 'Math.cos(degToRad(')
                .replace(/tan\(/g, 'Math.tan(degToRad(');
        }

        // Función para manejar funciones científicas especiales
        function scientificFunction(func) {
            const display = document.getElementById('display');
            
            try {
                let result;
                // Obtiene el valor actual como número
                let currentValue = parseFloat(currentInput) || 0;
                
                // Switch para manejar diferentes funciones científicas
                switch(func) {
                    case 'sin':
                        result = Math.sin(degToRad(currentValue));
                        break;
                    case 'cos':
                        result = Math.cos(degToRad(currentValue));
                        break;
                    case 'tan':
                        result = Math.tan(degToRad(currentValue));
                        break;
                    case 'asin':
                        if (currentValue >= -1 && currentValue <= 1) {
                            result = radToDeg(Math.asin(currentValue));
                        } else {
                            throw new Error('Dominio inválido');
                        }
                        break;
                    case 'acos':
                        if (currentValue >= -1 && currentValue <= 1) {
                            result = radToDeg(Math.acos(currentValue));
                        } else {
                            throw new Error('Dominio inválido');
                        }
                        break;
                    case 'atan':
                        result = radToDeg(Math.atan(currentValue));
                        break;
                    case 'log':
                        if (currentValue > 0) {
                            result = Math.log10(currentValue);
                        } else {
                            throw new Error('Logaritmo de número no positivo');
                        }
                        break;
                    case 'ln':
                        if (currentValue > 0) {
                            result = Math.log(currentValue);
                        } else {
                            throw new Error('Logaritmo natural de número no positivo');
                        }
                        break;
                    case 'pow':
                        result = Math.pow(currentValue, 2);
                        break;
                    case 'sqrt':
                        if (currentValue >= 0) {
                            result = Math.sqrt(currentValue);
                        } else {
                            throw new Error('Raíz cuadrada de número negativo');
                        }
                        break;
                    case 'factorial':
                        if (currentValue >= 0 && currentValue <= 170 && Number.isInteger(currentValue)) {
                            result = factorial(currentValue);
                        } else {
                            throw new Error('Factorial inválido');
                        }
                        break;
                    case 'percent':
                        result = currentValue / 100;
                        break;
                    default:
                        throw new Error('Función no reconocida');
                }
                
                // Redondea el resultado y actualiza la pantalla
                result = Math.round(result * 1000000000000) / 1000000000000;
                display.textContent = result.toString();
                currentInput = result.toString();
                shouldClear = true;
                
            } catch (error) {
                // Maneja errores en funciones científicas
                display.textContent = 'Error';
                currentInput = '';
                shouldClear = true;
            }
        }

        // Función auxiliar para convertir grados a radianes
        function degToRad(degrees) {
            return degrees * (Math.PI / 180);
        }

        // Función auxiliar para convertir radianes a grados
        function radToDeg(radians) {
            return radians * (180 / Math.PI);
        }

        // Función para calcular factorial de forma iterativa
        function factorial(n) {
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        // Event listener para soporte de teclado
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Mapeo de teclas del teclado a funciones de la calculadora
            if (key >= '0' && key <= '9') {
                appendToDisplay(key);
            } else if (key === '.') {
                appendToDisplay('.');
            } else if (key === '+') {
                appendToDisplay('+');
            } else if (key === '-') {
                appendToDisplay('-');
            } else if (key === '*') {
                appendToDisplay('*');
            } else if (key === '/') {
                event.preventDefault(); // Previene la búsqueda del navegador
                appendToDisplay('/');
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearDisplay();
            } else if (key === '(' || key === ')') {
                appendToDisplay(key);
            }
        });