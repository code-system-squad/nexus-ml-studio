import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Sparkles, User, Bot, ChevronRight } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  options?: string[];
}

const AIAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "¡Hola! Soy tu asistente virtual electoral. Puedo brindarte información detallada sobre los candidatos de las tres categorías: Presidencial, Congresistas y Distrital. ¿Qué categoría te interesa?",
      isUser: false,
      timestamp: new Date(),
      options: [
        "🏛️ Presidencial",
        "🏢 Congresistas",
        "📍 Distrital",
        "ℹ️ ¿Cómo votar?"
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([
    "🏛️ Presidencial",
    "🏢 Congresistas",
    "📍 Distrital",
    "ℹ️ ¿Cómo votar?"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const candidatesData = {
    presidencial: [
      {
        nombre: "María González",
        partido: "Partido Progreso",
        propuestas: [
          "Educación y tecnología para el desarrollo nacional",
          "Reforma del sistema de salud pública",
          "Inversión en infraestructura digital",
          "Protección de derechos sociales"
        ],
        experiencia: "Senadora, ex Ministra de Educación",
        descripcion: "Propuesta enfocada en educación y tecnología para el desarrollo nacional"
      },
      {
        nombre: "Carlos Ramírez",
        partido: "Alianza Nacional",
        propuestas: [
          "Plan de gobierno centrado en economía",
          "Generación masiva de empleo",
          "Apoyo a pequeñas y medianas empresas",
          "Modernización del aparato productivo"
        ],
        experiencia: "Economista, ex Gobernador Regional",
        descripcion: "Plan de gobierno centrado en economía y generación de empleo"
      },
      {
        nombre: "Ana Torres",
        partido: "Frente Unido",
        propuestas: [
          "Enfoque en salud pública y bienestar social",
          "Programas de inclusión social",
          "Fortalecimiento del sistema de pensiones",
          "Atención primaria universal"
        ],
        experiencia: "Médica, activista social",
        descripcion: "Enfoque en salud pública y bienestar social"
      }
    ],
    congresistas: [
      {
        nombre: "Luis Martínez",
        partido: "Partido Progreso",
        propuestas: [
          "Políticas de infraestructura y desarrollo urbano",
          "Modernización del transporte público",
          "Vivienda social accesible",
          "Mejora de servicios básicos"
        ],
        experiencia: "Ingeniero Civil, ex Regidor",
        descripcion: "Experiencia en políticas de infraestructura y desarrollo urbano"
      },
      {
        nombre: "Patricia Silva",
        partido: "Alianza Nacional",
        propuestas: [
          "Especialista en legislación laboral",
          "Derechos de los trabajadores",
          "Reforma del código laboral",
          "Protección social para todos"
        ],
        experiencia: "Abogada laboralista, Congresista",
        descripcion: "Especialista en legislación laboral y derechos sociales"
      },
      {
        nombre: "Roberto Díaz",
        partido: "Frente Unido",
        propuestas: [
          "Defensor de la transparencia",
          "Lucha contra la corrupción",
          "Fiscalización efectiva",
          "Rendición de cuentas obligatoria"
        ],
        experiencia: "Periodista, activista anticorrupción",
        descripcion: "Defensor de la transparencia y la lucha contra la corrupción"
      }
    ],
    distrital: [
      {
        nombre: "Carmen Vega",
        partido: "Partido Progreso",
        propuestas: [
          "Líder comunitaria con enfoque en seguridad ciudadana",
          "Vigilancia barrial 24/7",
          "Programas de prevención del delito",
          "Espacios públicos seguros"
        ],
        experiencia: "Regidora, activista comunitaria",
        descripcion: "Líder comunitaria con enfoque en seguridad ciudadana"
      },
      {
        nombre: "Jorge Mendoza",
        partido: "Alianza Nacional",
        propuestas: [
          "Compromiso con el medio ambiente",
          "Gestión sostenible de residuos",
          "Áreas verdes y parques ecológicos",
          "Transporte limpio"
        ],
        experiencia: "Ambientalista, ex Alcalde",
        descripcion: "Compromiso con el medio ambiente y espacios públicos"
      },
      {
        nombre: "Sandra López",
        partido: "Frente Unido",
        propuestas: [
          "Promotora de cultura, deporte y recreación",
          "Eventos culturales gratuitos",
          "Infraestructura deportiva",
          "Espacios de recreación familiar"
        ],
        experiencia: "Gestora cultural, líder juvenil",
        descripcion: "Promotora de cultura, deporte y recreación"
      }
    ]
  };

  const getAIResponse = (userMessage: string): { text: string; options: string[] } => {
    const message = userMessage.toLowerCase();

    // Categoría Presidencial
    if (message.includes("presidencial") || message.includes("🏛️")) {
      return {
        text: "📋 **Candidatos Presidenciales**\n\nElección para presidente y vicepresidente de la nación:\n\n1️⃣ **María González** - Partido Progreso\n   Educación y tecnología\n\n2️⃣ **Carlos Ramírez** - Alianza Nacional\n   Economía y empleo\n\n3️⃣ **Ana Torres** - Frente Unido\n   Salud y bienestar social\n\n¿Sobre cuál deseas más información?",
        options: [
          "María González",
          "Carlos Ramírez",
          "Ana Torres",
          "🔙 Volver a categorías"
        ]
      };
    }

    // Categoría Congresistas
    if (message.includes("congresistas") || message.includes("congreso") || message.includes("🏢")) {
      return {
        text: "📋 **Candidatos al Congreso Nacional**\n\nRepresentantes ante el Congreso Nacional:\n\n1️⃣ **Luis Martínez** - Partido Progreso\n   Infraestructura y desarrollo\n\n2️⃣ **Patricia Silva** - Alianza Nacional\n   Legislación laboral\n\n3️⃣ **Roberto Díaz** - Frente Unido\n   Transparencia y anticorrupción\n\n¿Sobre cuál deseas más información?",
        options: [
          "Luis Martínez",
          "Patricia Silva",
          "Roberto Díaz",
          "🔙 Volver a categorías"
        ]
      };
    }

    // Categoría Distrital
    if (message.includes("distrital") || message.includes("distrito") || message.includes("📍")) {
      return {
        text: "📋 **Candidatos Distritales**\n\nRepresentantes del distrito local y municipal:\n\n1️⃣ **Carmen Vega** - Partido Progreso\n   Seguridad ciudadana\n\n2️⃣ **Jorge Mendoza** - Alianza Nacional\n   Medio ambiente\n\n3️⃣ **Sandra López** - Frente Unido\n   Cultura y recreación\n\n¿Sobre cuál deseas más información?",
        options: [
          "Carmen Vega",
          "Jorge Mendoza",
          "Sandra López",
          "🔙 Volver a categorías"
        ]
      };
    }

    // Candidatos Presidenciales individuales
    if (message.includes("maría gonzález") || message.includes("maria gonzalez") || message === "maría gonzález") {
      const info = candidatesData.presidencial[0];
      return {
        text: `👤 **${info.nombre}**\n${info.partido}\n\n📋 ${info.descripcion}\n\n✨ **Propuestas principales:**\n${info.propuestas.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n👔 **Experiencia:** ${info.experiencia}`,
        options: ["Carlos Ramírez", "Ana Torres", "🏛️ Presidencial", "🔙 Volver a categorías"]
      };
    }

    if (message.includes("carlos ramírez") || message.includes("carlos ramirez") || message === "carlos ramírez") {
      const info = candidatesData.presidencial[1];
      return {
        text: `👤 **${info.nombre}**\n${info.partido}\n\n📋 ${info.descripcion}\n\n✨ **Propuestas principales:**\n${info.propuestas.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n👔 **Experiencia:** ${info.experiencia}`,
        options: ["María González", "Ana Torres", "🏛️ Presidencial", "🔙 Volver a categorías"]
      };
    }

    if (message.includes("ana torres")) {
      const info = candidatesData.presidencial[2];
      return {
        text: `👤 **${info.nombre}**\n${info.partido}\n\n📋 ${info.descripcion}\n\n✨ **Propuestas principales:**\n${info.propuestas.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n👔 **Experiencia:** ${info.experiencia}`,
        options: ["María González", "Carlos Ramírez", "🏛️ Presidencial", "🔙 Volver a categorías"]
      };
    }

    // Candidatos Congresistas individuales
    if (message.includes("luis martínez") || message.includes("luis martinez")) {
      const info = candidatesData.congresistas[0];
      return {
        text: `👤 **${info.nombre}**\n${info.partido}\n\n📋 ${info.descripcion}\n\n✨ **Propuestas principales:**\n${info.propuestas.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n👔 **Experiencia:** ${info.experiencia}`,
        options: ["Patricia Silva", "Roberto Díaz", "🏢 Congresistas", "🔙 Volver a categorías"]
      };
    }

    if (message.includes("patricia silva")) {
      const info = candidatesData.congresistas[1];
      return {
        text: `👤 **${info.nombre}**\n${info.partido}\n\n📋 ${info.descripcion}\n\n✨ **Propuestas principales:**\n${info.propuestas.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n👔 **Experiencia:** ${info.experiencia}`,
        options: ["Luis Martínez", "Roberto Díaz", "🏢 Congresistas", "🔙 Volver a categorías"]
      };
    }

    if (message.includes("roberto díaz") || message.includes("roberto diaz")) {
      const info = candidatesData.congresistas[2];
      return {
        text: `👤 **${info.nombre}**\n${info.partido}\n\n📋 ${info.descripcion}\n\n✨ **Propuestas principales:**\n${info.propuestas.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n👔 **Experiencia:** ${info.experiencia}`,
        options: ["Luis Martínez", "Patricia Silva", "🏢 Congresistas", "🔙 Volver a categorías"]
      };
    }

    // Candidatos Distritales individuales
    if (message.includes("carmen vega")) {
      const info = candidatesData.distrital[0];
      return {
        text: `👤 **${info.nombre}**\n${info.partido}\n\n📋 ${info.descripcion}\n\n✨ **Propuestas principales:**\n${info.propuestas.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n👔 **Experiencia:** ${info.experiencia}`,
        options: ["Jorge Mendoza", "Sandra López", "📍 Distrital", "🔙 Volver a categorías"]
      };
    }

    if (message.includes("jorge mendoza")) {
      const info = candidatesData.distrital[1];
      return {
        text: `👤 **${info.nombre}**\n${info.partido}\n\n📋 ${info.descripcion}\n\n✨ **Propuestas principales:**\n${info.propuestas.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n👔 **Experiencia:** ${info.experiencia}`,
        options: ["Carmen Vega", "Sandra López", "📍 Distrital", "🔙 Volver a categorías"]
      };
    }

    if (message.includes("sandra lópez") || message.includes("sandra lopez")) {
      const info = candidatesData.distrital[2];
      return {
        text: `👤 **${info.nombre}**\n${info.partido}\n\n📋 ${info.descripcion}\n\n✨ **Propuestas principales:**\n${info.propuestas.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n👔 **Experiencia:** ${info.experiencia}`,
        options: ["Carmen Vega", "Jorge Mendoza", "📍 Distrital", "🔙 Volver a categorías"]
      };
    }

    // Cómo votar
    if (message.includes("votar") || message.includes("voto") || message.includes("cómo") || message.includes("ℹ️")) {
      return {
        text: "📝 **Proceso de Votación**\n\nVotarás en 3 categorías diferentes:\n\n🏛️ **Presidencial**\nPresidente y vicepresidente de la nación\n\n🏢 **Congresistas**\nRepresentantes ante el Congreso Nacional\n\n📍 **Distrital**\nRepresentantes del distrito local y municipal\n\n**Pasos para votar:**\n1️⃣ Ingresa como votante\n2️⃣ Autentícate con tu DNI\n3️⃣ Revisa candidatos de cada categoría\n4️⃣ Selecciona 1 candidato por categoría\n5️⃣ Confirma tu voto seguro",
        options: ["🏛️ Presidencial", "🏢 Congresistas", "📍 Distrital", "🔒 Seguridad"]
      };
    }

    // Seguridad
    if (message.includes("segur") || message.includes("🔒")) {
      return {
        text: "🔐 **Seguridad del Sistema**\n\n✅ Encriptación de grado militar\n✅ Verificación biométrica avanzada\n✅ Blockchain para trazabilidad\n✅ Auditoría en tiempo real\n✅ Anonimato total garantizado\n✅ Certificación internacional\n\n🛡️ Tu voto está 100% protegido y es completamente privado.",
        options: ["🏛️ Presidencial", "🏢 Congresistas", "📍 Distrital", "ℹ️ ¿Cómo votar?"]
      };
    }

    // Volver a categorías
    if (message.includes("volver") || message.includes("categorías") || message.includes("🔙")) {
      return {
        text: "¿Qué categoría electoral te interesa conocer?",
        options: ["🏛️ Presidencial", "🏢 Congresistas", "📍 Distrital", "ℹ️ ¿Cómo votar?"]
      };
    }

    // Respuesta por defecto
    return {
      text: "Puedo ayudarte con información sobre los candidatos de las tres categorías electorales. ¿Cuál te interesa?",
      options: ["🏛️ Presidencial", "🏢 Congresistas", "📍 Distrital", "ℹ️ ¿Cómo votar?"]
    };
  };

  const handleOptionClick = (option: string) => {
    const userMessage: Message = {
      id: messages.length,
      text: option,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentOptions([]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(option);
      const aiResponse: Message = {
        id: messages.length + 1,
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        options: response.options
      };
      setMessages(prev => [...prev, aiResponse]);
      setCurrentOptions(response.options);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
          }
        }

        .chat-button {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .option-button {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}} />

      {/* Botón flotante del chat IA */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="chat-button fixed bottom-8 right-8 z-50 bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </button>
      )}

      {/* Ventana de Chat IA */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-96 h-[600px] bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header del chat */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Asistente Electoral IA</h3>
                <p className="text-xs text-red-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  En línea
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {message.isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl p-3 ${
                    message.isUser
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 rounded-2xl p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Opciones de botones */}
          {currentOptions.length > 0 && !isTyping && (
            <div className="p-4 bg-slate-800/50 border-t border-slate-700 space-y-2 max-h-64 overflow-y-auto">
              <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Selecciona una opción:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {currentOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="option-button bg-slate-700 hover:bg-red-600 text-white text-sm rounded-xl px-4 py-3 transition-all text-left flex items-center justify-between group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span>{option}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;