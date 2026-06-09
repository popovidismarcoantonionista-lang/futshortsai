import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import AdmZip from "adm-zip";
import { MatchAnalysis, VideoClip, SaaSMetrics, UserSubscription, PaymentReceipt, ServerLog } from "./src/types";

// Initialize Gemini Client
// We use a lazy initialization pattern to protect startup if key is missing.
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

const app = express();
app.use(express.json());

// In-memory Database to mimic durable cloud persistence / SQLite for mock prototype
const db = {
  analyses: [] as MatchAnalysis[],
  metrics: {
    totalUsers: 1482,
    activeSubscriptions: 423,
    totalRevenue: 24391.50,
    processedSeconds: 834190,
    clipsGenerated: 12431
  } as SaaSMetrics,
  subscriptions: [
    { id: "sub_1", email: "tony6044101aa@gmail.com", plan: "Champions", status: "active", price: "R$ 149,90", renewalDate: "2026-07-08" },
    { id: "sub_2", email: "lucas.silva@uol.com", plan: "Copinha", status: "active", price: "R$ 49,90", renewalDate: "2026-06-25" },
    { id: "sub_3", email: "neymar.jr@santos.com", plan: "Champions", status: "active", price: "R$ 149,90", renewalDate: "2026-07-01" },
    { id: "sub_4", email: "ronaldo9@phenom.com", plan: "Pro", status: "active", price: "R$ 99,90", renewalDate: "2026-06-18" },
    { id: "sub_5", email: "babi.futebol@vibe.tv", plan: "Free", status: "cancelled", price: "R$ 0,00", renewalDate: "expired" }
  ] as UserSubscription[],
  payments: [
    { id: "pay_1", userEmail: "tony6044101aa@gmail.com", amount: 149.90, status: "approved", paymentMethod: "Pix", date: "2026-06-08 14:32" },
    { id: "pay_2", userEmail: "lucas.silva@uol.com", amount: 49.90, status: "approved", paymentMethod: "CreditCard", date: "2026-05-25 10:11" },
    { id: "pay_3", userEmail: "neymar.jr@santos.com", amount: 149.90, status: "approved", paymentMethod: "Pix", date: "2026-06-01 09:00" },
    { id: "pay_4", userEmail: "babi.futebol@vibe.tv", amount: 49.90, status: "failed", paymentMethod: "CreditCard", date: "2026-05-01 19:45" }
  ] as PaymentReceipt[],
  logs: [
    { id: "log_1", timestamp: new Date().toISOString(), level: "info", component: "AI Engine", message: "Motor Fut Shorts AI iniciado com sucesso." },
    { id: "log_2", timestamp: new Date().toISOString(), level: "info", component: "Queue Manager", message: "Gerenciador de tarefas Redas/BullMQ pronto." },
    { id: "log_3", timestamp: new Date().toISOString(), level: "info", component: "Transcription", message: "API Whisper conectada para extração de áudio." }
  ] as ServerLog[]
};

// Seed with default analyses to make the dashboard look populated and high fidelity
const seedAnalyses: MatchAnalysis[] = [
  {
    id: "match_seed_1",
    videoName: "Flamengo 3x2 Palmeiras - Bastidores e Melhores Momentos",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=fla-pal-2026",
    uploadedAt: "2026-06-08T18:30:00Z",
    status: "completed",
    matchInfo: {
      teams: "Flamengo vs Palmeiras",
      highlightsCount: 5,
      summary: "Jogo espetacular no Maracanã com 5 gols. Flamengo abriu vantagem, Palmeiras empatou, mas Gabigol garantiu a vitória nos acréscimos. Muita provocação no banco e polêmica de arbitragem com o VAR."
    },
    clips: [
      {
        id: "clip_fla_1",
        title: "Golaço de Gabigol aos 92min nos acréscimos",
        category: "gol",
        duration: 30,
        scores: { viral: 98, retention: 94, engagement: 97, ctr: 92 },
        timestamps: { start: "05:12", end: "05:42" },
        vibe: "Euphoria, Epic, Loud crowd reaction",
        titles: [
          "NINGUÉM ACREDITOU NO QUE ELE FEZ NO FINAL! 🚨",
          "Gabigol decidiu o clássico no último minuto!",
          "O Maracanã quase desmoronou com esse gol!",
          "O chute impossível de Gabigol aos 92 minutos!",
          "Palmeirenses choram com esse gol histórico!",
          "A virada inacreditável do Flamengo!",
          "Proclamação do rei da área mais uma vez!",
          "Tite ficou sem reação com esse gol!",
          "Simplesmente Gabigol sendo decisivo!",
          "A comemoração que revoltou a torcida adversária!"
        ],
        descriptions: {
          shorts: "O Maracanã EXPLODIU com esse golaço de Gabigol aos 92 minutos! O Flamengo vence as finais! #flamengo #palmeiras #mengo",
          tiktok: "🚨 GABIGOL FAZ O INACREDITÁVEL NO FIM! 🔴⚫️ Chute perfeito no ângulo! Curte e compartilha se você arrepiou também! #futebolbrasileiro #brasileirao #mengao #golaço",
          reels: "Momentos históricos do futebol brasileiro! Gabigol marca aos 92 minutos o gol do título! 🏆⚽️ #futebol #flamengo #classico #viral"
        },
        hashtags: ["gabigol", "flamengo", "palmeiras", "golaço", "classico", "mengao", "brasileirao", "viral"],
        thumbnail: {
          text: "IMPOSSÍVEL AOS 92'!",
          layoutDescription: "Expressão em close do Gabigol com fundo escurecido e faíscas de fogo nas laterais.",
          suggestedColors: ["#EF4444", "#F59E0B"]
        },
        report: {
          whySelected: "Este foi o momento principal do jogo, trazendo um gol de final de partida, o que gera alta retenção motivada por herança de suspense e pico de adrenalina dos torcedores na cena real.",
          emotionDetected: "Euforia mútua, desespero da zaga defensiva e fúria competitiva.",
          retentionPotential: "Altíssimo. O arco dramático do lance inicia-se na roubada de bola aos 12 segundos e finaliza com a explosão da torcida nos acréscimos.",
          sharingPotential: "Momento altamente polarizado que vai incitar discussões ferozes nos comentários entre rivais, alavancando o engajamento orgânico do algoritmo."
        },
        mockVideoUrl: ""
      },
      {
        id: "clip_fla_2",
        title: "Confusão e Provocação de Abel Ferreira com o Banco",
        category: "polêmica",
        duration: 45,
        scores: { viral: 91, retention: 89, engagement: 95, ctr: 88 },
        timestamps: { start: "02:40", end: "03:25" },
        vibe: "Tense, Confrontational, Drama",
        titles: [
          "ABEL FERREIRA PERDEU A CABEÇA NO MARACANÃ! 🤬",
          "A provocação que iniciou a briga generalizada!",
          "Clima esquentou feio no banco de reservas!",
          "Árbitro teve que intervir! Confusão Flamengo x Palmeiras",
          "Abel Ferreira x Banco do Flamengo! Quem tem razão?",
          "Confusão nos bastidores revela racha terrível!",
          "Sombra de briga violenta no futebol brasileiro!",
          "As palavras exatas que geraram o empurrão!",
          "Abel Ferreira se revolta e chuta copo d'água!",
          "Entenda por que essa cena está viralizando no TikTok!"
        ],
        descriptions: {
          shorts: "Clima esquentou total entre Abel Ferreira e a comissão técnica do Flamengo! Polêmica pura no clássico! #abelferreira #polemica #treta",
          tiktok: "🤬 TRETA FEIA NO CLÁSSICO! Abel Ferreira encarou o banco e o clima ferveu! O que você achou dessa atitude? Deixe nos comentários! #polêmica #futebolmuleke #flamengo #palmeiras",
          reels: "O futebol é emoção à flor da pele! Abel Ferreira e a comissão do Flamengo em discussão acalorada na beira do campo. 🔥🍿 #tretafutebol #classico #futebolbrasileiro"
        },
        hashtags: ["treta", "polêmica", "abelferreira", "flamengo", "palmeiras", "maracanã", "debatetatico"],
        thumbnail: {
          text: "PERDEU A CABEÇA?!",
          layoutDescription: "Abel Ferreira apontando o dedo com expressão irritada, destacado por um círculo vermelho neon na cena.",
          suggestedColors: ["#10B981", "#EF4444"]
        },
        report: {
          whySelected: "Tretas na beira do campo geram alta curiosidade mórbida no usuário comum do Shorts. As pessoas querem ver conflito e discussão.",
          emotionDetected: "Hostilidade e indignação competitiva.",
          retentionPotential: "A velocidade dos diálogos e gestos rápidos prendem o espectador até a decisão do árbitro de dar cartões aos envolvidos.",
          sharingPotential: "Induzirá compartilhamentos imediatos de palmeirenses defendendo o técnico e rivais chamando o treinador de chorão."
        },
        mockVideoUrl: ""
      }
    ]
  },
  {
    id: "match_seed_2",
    videoName: "Brasil 1x0 Argentina - Narrado Galvão Retrô",
    videoSourceType: "upload",
    uploadedAt: "2026-06-07T12:15:00Z",
    status: "completed",
    matchInfo: {
      teams: "Brasil vs Argentina",
      highlightsCount: 3,
      summary: "Amistoso master inesquecível com gol único de falta magistral de Ronaldinho Gaúcho."
    },
    clips: [
      {
        id: "clip_bra_1",
        title: "Golaço de Falta Ronaldinho Gaúcho por baixo da barreira",
        category: "gol",
        duration: 30,
        scores: { viral: 99, retention: 97, engagement: 98, ctr: 95 },
        timestamps: { start: "01:05", end: "01:35" },
        vibe: "Nostalgic, Genius, Pure magic",
        titles: [
          "O DIA QUE O BRUXO ENGANOU A BARREIRA TODA! 🧙‍♂️",
          "RonaldinhoGaúcho humilhando zagueiros argentinos!",
          "Esse lance provou que a física não funciona com o Bruxo!",
          "A falta mais inteligente da história do clássico!",
          "Ninguém esperava por esse chute milimétrico!",
          "Nem o goleiro se mexeu! Magia pura de falta!",
          "O dia que a Argentina parou para aplaudir Ronaldinho!",
          "Um gol que só um gênio conseguiria conceber!",
          "Você já tinha visto esse ângulo lendário de falta?",
          "O futebol respira classe pura com o Bruxo!"
        ],
        descriptions: {
          shorts: "A genialidade indiscutível de Ronaldinho Gaúcho cobrando falta por baixo da barreira contra a Argentina! #bruxo #ronaldinho #futebol",
          tiktok: "🧙‍♂️ MAGIA PURA DO BRUXO! Por baixo da barreira contra nossa maior rival! Quem tem saudades dessa época de ouro? #ronaldinhogaucho #seleçãobrasileira #futebolarte #golaço",
          reels: "Impossível esquecer desse dia! Ronaldinho reescrevendo os manuais de falta! Clássico é clássico! 🇧🇷🇦🇷 #ronaldinho #futebolbrasileiro #brasil #nostalgia"
        },
        hashtags: ["ronaldinho", "bruxo", "brasil", "argentina", "magic", "golaçodefalta", "generations"],
        thumbnail: {
          text: "ENGANOU O MUNDO!",
          layoutDescription: "Foco no Ronaldinho rindo no momento da cobrança, com uma trilha brilhante apontando a trajetória da bola sob as chuteiras.",
          suggestedColors: ["#FBBF24", "#3B82F6"]
        },
        report: {
          whySelected: "Fator Nostalgia aliado à raridade técnica extrema. O momento atinge públicos de todas as faixas etárias de fãs de futebol globalmente.",
          emotionDetected: "Admiração de genialidade, respeito esportivo.",
          retentionPotential: "O suspense construído na preparação da cobrança cria retenção garantida até a bola tocar o fundo das redes.",
          sharingPotential: "Altíssimo. Todo fanático de futebol ama compartilhar relíquias de jogadas geniais de Ronaldinho Gaúcho."
        },
        mockVideoUrl: ""
      }
    ]
  }
];

// Initialize DB with seeds
db.analyses.push(...seedAnalyses);

function addLog(level: "info" | "warn" | "error", component: "AI Engine" | "Transcription" | "Queue Manager" | "Video Clipper" | "Billing", message: string) {
  db.logs.unshift({
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    level,
    component,
    message
  });
  if (db.logs.length > 100) {
    db.logs.pop();
  }
}

// ---------------------- API ROUTES ----------------------

// SaaS Metrics API
app.get("/api/metrics", (req, res) => {
  res.json(db.metrics);
});

// Admin Database Stats API
app.get("/api/admin/stats", (req, res) => {
  res.json({
    metrics: db.metrics,
    subscriptions: db.subscriptions,
    payments: db.payments,
    logs: db.logs
  });
});

// Create/Update sub mock API
app.post("/api/admin/subscriptions", (req, res) => {
  const { email, plan, status, price } = req.body;
  if (!email || !plan) {
    return res.status(400).json({ error: "Email e Plano são requeridos." });
  }
  const isExisting = db.subscriptions.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (isExisting) {
    isExisting.plan = plan;
    isExisting.status = status || "active";
    isExisting.price = price || "R$ 99,90";
    addLog("info", "Billing", `Assinatura de ${email} atualizada para o plano ${plan}.`);
  } else {
    const newSub: UserSubscription = {
      id: `sub_${Date.now()}`,
      email,
      plan,
      status: status || "active",
      price: price || "R$ 99,90",
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    db.subscriptions.unshift(newSub);
    db.metrics.activeSubscriptions += 1;
    db.metrics.totalUsers += 1;
    addLog("info", "Billing", `Nova assinatura inserida pelo painel de admin: ${email} (${plan}).`);
  }
  // Record dynamic payment for fidelity
  const am = parseFloat(price ? price.replace("R$ ", "").replace(",", ".") : "99.90") || 99.90;
  const newPay: PaymentReceipt = {
    id: `pay_${Date.now()}`,
    userEmail: email,
    amount: am,
    status: "approved",
    paymentMethod: "Pix",
    date: new Date().toISOString().replace("T", " ").substring(0, 16)
  };
  db.payments.unshift(newPay);
  db.metrics.totalRevenue += am;

  res.json({ success: true, subscriptions: db.subscriptions });
});

// List Analyses API
app.get("/api/analyses", (req, res) => {
  res.json(db.analyses);
});

// Delete Analysis API
app.delete("/api/analyses/:id", (req, res) => {
  const { id } = req.params;
  const initialLen = db.analyses.length;
  db.analyses = db.analyses.filter(a => a.id !== id);
  if (db.analyses.length < initialLen) {
    addLog("info", "Queue Manager", `Análise de futebol ID ${id} removida pelo usuário.`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Análise não cadastrada." });
  }
});

// POST Analyze Video API
app.post("/api/analyze", async (req, res) => {
  const { videoName, videoSourceType, videoUrl, selectedTopCount, userMatchContext } = req.body;

  if (!videoName) {
    return res.status(400).json({ error: "Nome ou Link do vídeo de futebol é obrigatório" });
  }

  const cleanVideoName = videoName.replace(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//g, "");
  const topCount = parseInt(selectedTopCount) || 5;
  const analysisId = `match_${Date.now()}`;

  addLog("info", "AI Engine", `Nova requisição recebida: '${videoName}'. Extraindo áudio e gerando timestamps...`);
  addLog("info", "Transcription", `Extraindo áudio do fluxo soccer via canal Whisper, organizando falas...`);

  // Create idle record first to simulate processing pipeline
  const newAnalysis: MatchAnalysis = {
    id: analysisId,
    videoName: cleanVideoName,
    videoSourceType,
    videoUrl: videoUrl || "",
    uploadedAt: new Date().toISOString(),
    status: "processing",
    matchInfo: {
      teams: "Buscando informações...",
      highlightsCount: 0,
      summary: "Iniciando Whisper Transcrição, timestamps e detecção tática de jogadas de futebol..."
    },
    clips: []
  };

  db.analyses.unshift(newAnalysis);

  // We perform real Gemini parsing to generate soccer-centric viral outcomes
  const ai = getAi();
  if (ai) {
    try {
      addLog("info", "AI Engine", `Iniciando processamento tático usando modelo gemini-3.5-flash com instruções do futebol brasileiro.`);
      
      const prompt = `
        Você é um motor de Inteligência Artificial de elite especializado em clipping esportivo e análise tática do de Futebol chamado FUT SHORTS AI.
        Usuário enviou um vídeo de futebol com nome/link: "${videoName}".
        Contexto extra do usuário sobre as principais jogadas: "${userMatchContext || 'Nenhum contexto adicional fornecido. Detecte momentos aleatórios realistas de futebol internacional ou do Brasileirão com base na pista fornecida no nome'}"
        Quantidade máxima de cortes virais a retornar: ${topCount}.
        
        Você deve gerar uma análise realista de futebol no formato JSON contendo:
        1. "teams": Os nomes dos times que se enfrentaram (ex: "Flamengo vs Vasco", "Brasil vs Alemanha" ou similar baseado no nome).
        2. "summary": Uma síntese geral do jogo tático e por que o jogo foi emocionante (1-3 parágrafos em Português).
        3. "clips": Uma lista contendo exatamente ${topCount} clipes de momentos de futebol altamente virais (ex: gols, discussões, polêmicas de VAR, quase gols famosos, cartões vermelhos dramáticos, coletivas furiosas, provocações, bastidores de vestiário, declarações polêmicas ou análises táticas incríveis).
        
        Para CADA clipe, você DEVE retornar as seguintes informações em PORTUGUÊS de forma extremamente completa:
        - "title": O título tático do clipe (ex: "Golaço de falta na gaveta aos 35min", "VAR anula gol controverso e clima esquenta")
        - "category": Uma das categorias: "gol", "quase gol", "assistência", "cartão", "entrevista", "coletiva", "polêmica", "provocação", "bastidores", "análise tática" ou "notícias urgentes".
        - "duration": Duração estimada (pode ser 30, 45, 60, 90 segundos)
        - "timestamps": Objeto com "start" (ex: "02:15") e "end" (ex: "02:45")
        - "vibe": Uma string com a energia do lance (ex: "Clima tenso, torcida enfurecida", "Magia pura, gargalhada tática")
        - "scores": Um objeto com avaliações de 0 a 100: "viral", "retention", "engagement", "ctr"
        - "titles": Exatamente 10 títulos propostos para viralizar nas redes sociais (ex: "Ninguém Esperava Isso!", "O Lance Que Está Viralizando!", "O Futebol Parou Para Ver Isso!"). Seja criativo e use clickbait inteligente do futebol.
        - "descriptions": Objeto contendo "shorts", "tiktok" e "reels" (cada uma adaptada para sua rede social com emojis e hashtag sintonizada).
        - "hashtags": Uma lista com 6 a 10 hashtags (ex: ["flamengo", "reacoes", "debateesportivo"])
        - "thumbnail": Objeto com "text" (texto impactante para escrever na thumbnail), "layoutDescription" (ideia detalhada do layout para o designer ou criador de imagem), "suggestedColors" (2 cores impactantes em código hexadecimais como ["#FE0101", "#FFD700"]).
        - "report": Objeto com "whySelected" (Explicação de por que foi selecionado pelo clipping de IA), "emotionDetected" (Qual emoção foi encontrada nos rostos e barulho do lance), "retentionPotential" (A taxa de retenção prevista e gatilho de suspense), "sharingPotential" (Por que as pessoas vão enviar no WhatsApp ou marcar amigos).
        
        Retorne APENAS o JSON válido sem markdown extra, sem blocos de código com a palavra json. O JSON precisa seguir a tipagem declarada.
      `;

      addLog("info", "AI Engine", "Enviando Prompt ao Gemini-3.5-Flash para curadoria dos melhores momentos...");
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      const responseText = response.text || "{}";
      // Pure json parsing clean-up
      let cleanJsonStr = responseText.trim();
      if (cleanJsonStr.startsWith("```json")) {
        cleanJsonStr = cleanJsonStr.replace(/^```json/, "").replace(/```$/, "");
      } else if (cleanJsonStr.startsWith("```")) {
        cleanJsonStr = cleanJsonStr.replace(/^```/, "").replace(/```$/, "");
      }
      cleanJsonStr = cleanJsonStr.trim();
      
      const parsed = JSON.parse(cleanJsonStr);

      const clips: VideoClip[] = (parsed.clips || []).map((c: any, index: number) => {
        return {
          id: `clip_${analysisId}_${index + 1}`,
          title: c.title || `Momento Viral #${index + 1}`,
          category: c.category || "gol",
          duration: c.duration || 30,
          scores: c.scores || { viral: 85, retention: 80, engagement: 82, ctr: 88 },
          timestamps: c.timestamps || { start: `02:${index * 20}`, end: `02:${index * 20 + 30}` },
          vibe: c.vibe || "Euphoria, High adrenaline",
          titles: c.titles || [
            "Ninguém Esperava Isso! 🚨",
            "O Futebol Parou Para Ver Isso!",
            "O Lance Que Está Viralizando!",
            "A Declaração Que Revoltou a Torcida!",
            "O maior absurdo do jogo tático!",
            "Este momento mudou toda a história",
            "Foi por isso que todo mundo parou!",
            "Se você não viu esse lance, não assistiu nada!",
            "A polêmica que vai render assunto por meses!",
            "Impossível segurar o riso ou a lágrima com isso!"
          ],
          descriptions: c.descriptions || {
            shorts: "Assista a esse lance incrível e tire suas próprias conclusões! #futebol #brasileirao #shorts",
            tiktok: "🚨 O LANCE QUE ESTÁ DEIXANDO AS REDES SOCIAIS EM CHOQUE! Você concorda com o árbitro? Comente agora! #futvirais #tiktokfutebol #opinião",
            reels: "Um momento icônico para a história dos clássicos nacionais! Salve para rever depois. ⚽️🏆 #reelsfutebol #futebolarte #golaço"
          },
          hashtags: c.hashtags || ["futebol", "futshorts", "viral", "polemica", "gol"],
          thumbnail: c.thumbnail || {
            text: "NINGUÉM ESPERAVA ISSO!",
            layoutDescription: "Foco de close-up na bola acertando a rede com brilho dourado e contraste acentuado.",
            suggestedColors: ["#EF4444", "#3B82F6"]
          },
          report: c.report || {
            whySelected: "Clip selecionado de forma automática por apresentar mudança de tom extremo, velocidade explosiva no lance e pico sonoro do estádio.",
            emotionDetected: "Estupor geral e celebração competitiva.",
            retentionPotential: "Excelente arco de desenvolvimento que culmina com a jogada completa em menos de 30 segundos, prendendo o olho na tela.",
            sharingPotential: "Fator de identificação imediata que leva o público a debater nos comentários de grupos familiares."
          },
          mockVideoUrl: "" // Will be assigned locally
        };
      });

      // Update the record with processed data
      newAnalysis.status = "completed";
      newAnalysis.matchInfo = {
        teams: parsed.teams || "Clássico Detectado",
        highlightsCount: clips.length,
        summary: parsed.summary || "Vídeo processado com sucesso. Cortes de futebol identificados e prontos para distribuição viral."
      };
      newAnalysis.clips = clips;

      // Update metrics
      db.metrics.processedSeconds += (clips.length * 45);
      db.metrics.clipsGenerated += clips.length;

      addLog("info", "Video Clipper", `Clipper gerou ${clips.length} cortes com timestamps de forma síncrona.`);
      addLog("info", "AI Engine", `Análise de futebol finalizada com sucesso para '${newAnalysis.matchInfo.teams}'!`);
      
      res.json(newAnalysis);

    } catch (err: any) {
      addLog("error", "AI Engine", `Erro ao analisar via Gemini API: ${err.message}. Ativando gerador inteligente offline de emergência...`);
      fallbackGenerate(cleanVideoName, topCount, userMatchContext, newAnalysis, res);
    }
  } else {
    addLog("warn", "AI Engine", "Gemini API Key não detectada ou é padrão placeholder. Ativando simulador de futebol de alta performance...");
    fallbackGenerate(cleanVideoName, topCount, userMatchContext, newAnalysis, res);
  }
});

// Fallback algorithm that mimics the exact requested structure beautifully if Gemini fails or is keysless
function fallbackGenerate(videoName: string, topCount: number, userMatchContext: string, record: MatchAnalysis, res: any) {
  const isPalmeiras = videoName.toLowerCase().includes("palmeiras") || (userMatchContext && userMatchContext.toLowerCase().includes("palmeiras"));
  const isSantos = videoName.toLowerCase().includes("santos") || (userMatchContext && userMatchContext.toLowerCase().includes("santos"));
  
  let teams = "Vasco vs Flamengo - Clássico Carioca";
  let summary = "Uma partida tática eletrizante cheia de viradas espetaculares, reações furiosas da torcida no estádio e um polêmico lance de cartão vermelho que incendiou os analistas de esportes.";
  
  if (isPalmeiras) {
    teams = "Palmeiras vs Corinthians - Derby Paulista";
    summary = "O caldeirão ferveu no Derby Paulista! Um clássico tenso marcado por marcação cerrada de ambos os lados, expulsão de volante no primeiro tempo e gol heróico de cobertura para coroar a noite.";
  } else if (isSantos) {
    teams = "Santos vs São Paulo - San-São";
    summary = "Um espetáculo de futebol ofensivo na Vila Belmiro com dribles desconcertantes, quase gols incríveis salvos em cima da linha e polêmicas de arbitragem sobre pênaltis duvidosos.";
  }

  const clips: VideoClip[] = [];
  const categories: Array<VideoClip["category"]> = ["gol", "polêmica", "quase gol", "provocação", "entrevista", "assistência", "bastidores", "análise tática"];
  
  for (let i = 0; i < topCount; i++) {
    const cat = categories[i % categories.length];
    const duration = [30, 45, 60, 90][i % 4];
    const scoreBase = 85 + Math.floor(Math.random() * 15);
    
    clips.push({
      id: `clip_${record.id}_${i + 1}`,
      title: `Destaque Viral #${i + 1} - LANCE DE [${cat.toUpperCase()}]`,
      category: cat,
      duration: duration,
      scores: {
        viral: scoreBase,
        retention: scoreBase - Math.floor(Math.random() * 7),
        engagement: scoreBase - Math.floor(Math.random() * 5),
        ctr: scoreBase - Math.floor(Math.random() * 9)
      },
      timestamps: {
        start: `0${i}:15`,
        end: `0${i}:${15 + duration}`
      },
      vibe: "Adrenalina pura, ruído ensurdecedor dos adeptos e choque dramático.",
      titles: [
        "Ninguém Esperava Isso! 🚨",
        "O Futebol Parou Para Ver Isso!",
        "O Lance Que Está Viralizando!",
        "A Declaração Que Revoltou a Torcida!",
        `O lance mais controverso da categoria ${cat}!`,
        "O juiz ficou completamente sem rumo!",
        "Esse corte de futebol está explodindo visualizações!",
        "Drible humilhante que quebrou a internet!",
        "Clima esquentou total na beira do campo!",
        "O maior achado desse campeonato de futebol!"
      ],
      descriptions: {
        shorts: `Vídeo inacreditável capturado no jogo ${teams}! Você concorda com essa reação? #futebol #futebolbrasileiro #shortsviral`,
        tiktok: `💥 O LANCE MAIS VIRAL DA SEMANA! Veja o que aconteceu nesse momento de ${cat} no clássico. Se inscreva para mais cortes diários! #futebolarte #tiktokbrasil #soccerclips`,
        reels: `Futebol é arte, emoção e polêmica! Siga-nos para não perder nenhum short viral das grandes ligas nacionais. 🍿✨ #reelsfutebol #corinthians #flamengo #classico`
      },
      hashtags: ["futebol", cat, "soccer", "viral", "futshortsai", "clashing", "highlights"],
      thumbnail: {
        text: `SURREAL EM: ${cat.toUpperCase()}!`,
        layoutDescription: `Close dramático em preto e branco do jogador envolvido no lance, cortado por raios vermelhos neon com texto em amarelo chamativo.`,
        suggestedColors: ["#F59E0B", "#10B981"]
      },
      report: {
        whySelected: `Este momento de ${cat} possui um suspense tático excelente de 12 segundos antes do clímax, o que maximiza o retention rate exigido pelas redes de vídeo curto.`,
        emotionDetected: `Tensão, decepção defensiva extrema e pânico esportivo.`,
        retentionPotential: `Alto. O espectador permanece sintonizado no vídeo devido ao som dinâmico da narração e ritmo acelerado das câmeras.`,
        sharingPotential: `Combustível para debates acalorados sobre tática de futebol no WhatsApp e comunidades esportivas organizadas.`
      },
      mockVideoUrl: ""
    });
  }

  record.status = "completed";
  record.matchInfo = {
    teams,
    highlightsCount: clips.length,
    summary
  };
  record.clips = clips;

  db.metrics.processedSeconds += (clips.length * 45);
  db.metrics.clipsGenerated += clips.length;

  addLog("info", "Video Clipper", `Clipper offline gerou ${clips.length} cortes com timestamps com perfeição de simulação.`);
  addLog("info", "AI Engine", "Análise de emergência finalizada com sucesso.");

  res.json(record);
}

// ---------------------- BATCH & KIT COMPRESSION ZIP GENERATORS ----------------------

// Helper to simulate mp4 contents without bloating memory
const sampleVideoBuffer = Buffer.from("FIT-SHORTS-AI-SAMPLE-MP4-STREAM-DATA-SOCCER-HIGHLIGHT-RAW-BYTES-MOCK");

// 1. INDIVIDUAL CLIP DOWNLOAD
app.get("/api/download/clip/:clipId", (req, res) => {
  const { clipId } = req.params;
  res.setHeader("Content-Disposition", `attachment; filename="${clipId}.mp4"`);
  res.setHeader("Content-Type", "video/mp4");
  res.send(sampleVideoBuffer);
});

// 2. BATCH DOWNLOAD (BAIXAR TODOS OS CORTES ZIP)
app.post("/api/download/batch", (req, res) => {
  const { clipIds, matchId } = req.body;
  
  if (!clipIds || !Array.isArray(clipIds) || clipIds.length === 0) {
    return res.status(400).json({ error: "IDs dos clipes são requeridos" });
  }

  const analysis = db.analyses.find(a => a.id === matchId);
  if (!analysis) {
    return res.status(404).json({ error: "Partida tática não encontrada" });
  }

  try {
    const zip = new AdmZip();

    // 1. Pack individual clips as files
    clipIds.forEach((cid, index) => {
      const clip = analysis.clips.find(c => c.id === cid);
      if (clip) {
        zip.addFile(`Clip_0${index + 1}.mp4`, sampleVideoBuffer);
      }
    });

    // 2. Add titles file
    let titlesText = "==================================================\n";
    titlesText += `  SUGESTÕES DE TÍTULOS VIRAIS - ${analysis.matchInfo.teams.toUpperCase()}\n`;
    titlesText += "==================================================\n\n";

    analysis.clips.forEach((clip, index) => {
      if (clipIds.includes(clip.id)) {
        titlesText += `[CLIP 0${index + 1}] Duração: ${clip.duration}s | Categoria: ${clip.category.toUpperCase()}\n`;
        titlesText += `Lance Original: ${clip.title}\n`;
        titlesText += `Timestamps: ${clip.timestamps.start} - ${clip.timestamps.end}\n`;
        titlesText += "Títulos Sugeridos para Redes Sociais:\n";
        clip.titles.forEach((t, i) => {
          titlesText += `   ${i + 1}. ${t}\n`;
        });
        titlesText += "\n--------------------------------------------------\n\n";
      }
    });
    zip.addFile("Titulos.txt", Buffer.from(titlesText, "utf-8"));

    // 3. Add descriptions file
    let descText = "==================================================\n";
    descText += `  DESCRIÇÕES PARA REDES SOCIAIS (SHORTS, TIKTOK, REELS)\n`;
    descText += "==================================================\n\n";

    analysis.clips.forEach((clip, index) => {
      if (clipIds.includes(clip.id)) {
        descText += `[CLIP 0${index + 1}] Categoria: ${clip.category.toUpperCase()}\n`;
        descText += "► SHORTS:\n";
        descText += `${clip.descriptions.shorts}\n\n`;
        descText += "► TIKTOK:\n";
        descText += `${clip.descriptions.tiktok}\n\n`;
        descText += "► REELS:\n";
        descText += `${clip.descriptions.reels}\n`;
        descText += "--------------------------------------------------\n\n";
      }
    });
    zip.addFile("Descricoes.txt", Buffer.from(descText, "utf-8"));

    // 4. Add Hashtags file
    let hashText = "==================================================\n";
    hashText += `  HASHTAGS AUTOMÁTICAS E ASSUNTO DETECTADO\n`;
    hashText += "==================================================\n\n";

    analysis.clips.forEach((clip, index) => {
      if (clipIds.includes(clip.id)) {
        hashText += `[CLIP 0${index + 1}] Categoria: ${clip.category.toUpperCase()}\n`;
        hashText += `Hashtags recomendadas: ${clip.hashtags.map(h => `#${h}`).join(" ")}\n\n`;
      }
    });
    zip.addFile("Hashtags.txt", Buffer.from(hashText, "utf-8"));

    const zipBuffer = zip.toBuffer();
    res.setHeader("Content-Disposition", `attachment; filename="futshorts_cortes_${matchId}.zip"`);
    res.setHeader("Content-Type", "application/zip");
    res.send(zipBuffer);
    
    // Increment download metrics
    db.metrics.processedSeconds += 30;

  } catch (error: any) {
    res.status(500).json({ error: "Erro ao gerar arquivo compactado: " + error.message });
  }
});

// 3. COMPLETE KIT DOWNLOAD (BAIXAR KIT COMPLETO)
app.post("/api/download/kit", (req, res) => {
  const { matchId } = req.body;
  const analysis = db.analyses.find(a => a.id === matchId);
  
  if (!analysis) {
    return res.status(404).json({ error: "Partida tática do kit não encontrada" });
  }

  try {
    const zip = new AdmZip();

    // 1. Add all clips
    analysis.clips.forEach((clip, index) => {
      zip.addFile(`Clip_0${index + 1}.mp4`, sampleVideoBuffer);
    });

    // 2. Titles txt
    let titlesText = `TÍTULOS VIRAIS AUTOMÁTICOS - FUT SHORTS AI\nPartido: ${analysis.matchInfo.teams}\n\n`;
    analysis.clips.forEach((clip, index) => {
      titlesText += `[Clip_0${index + 1}] - Categoria: ${clip.category.toUpperCase()} (${clip.duration} segundos)\n`;
      clip.titles.forEach((t, i) => {
        titlesText += `  ${i + 1}. ${t}\n`;
      });
      titlesText += "\n";
    });
    zip.addFile("Titulos.txt", Buffer.from(titlesText, "utf-8"));

    // 3. Descriptions txt
    let descText = `DESCRIÇÕES COMPLETAS - SHORTS / TIKTOK / REELS\n`;
    analysis.clips.forEach((clip, index) => {
      descText += `[Clip_0${index + 1}] (${clip.duration}s)\n`;
      descText += `-- SHORTS --\n${clip.descriptions.shorts}\n\n`;
      descText += `-- TIKTOK --\n${clip.descriptions.tiktok}\n\n`;
      descText += `-- REELS --\n${clip.descriptions.reels}\n`;
      descText += "========================================\n\n";
    });
    zip.addFile("Descricoes.txt", Buffer.from(descText, "utf-8"));

    // 4. Hashtags txt
    let hashText = `HASHTAGS DE ENGAJAMENTO VIRAL\n`;
    analysis.clips.forEach((clip, index) => {
      hashText += `[Clip_0${index + 1}]: ${clip.hashtags.map(h => `#${h}`).join(" ")}\n`;
    });
    zip.addFile("Hashtags.txt", Buffer.from(hashText, "utf-8"));

    // 5. Relatório de Viralização
    let viralReport = `======================================================================\n`;
    viralReport += `             RELATÓRIO TÁTICO DE VIRALIZAÇÃO E DESEMPENHO DE IA\n`;
    viralReport += `======================================================================\n`;
    viralReport += `Partida de Futebol: ${analysis.matchInfo.teams}\n`;
    viralReport += `Sintese da Partida: ${analysis.matchInfo.summary}\n\n`;

    analysis.clips.forEach((clip, index) => {
      viralReport += `------------------------------------------------------------\n`;
      viralReport += `[ARQUIVO: Clip_0${index + 1}.mp4] -> ${clip.title}\n`;
      viralReport += `------------------------------------------------------------\n`;
      viralReport += `Métricas de IA:\n`;
      viralReport += `   - VIRAL SCORE:      ${clip.scores.viral}/100\n`;
      viralReport += `   - ENGAGEMENT SCORE: ${clip.scores.engagement}/100\n`;
      viralReport += `   - CTR ESTIMADO:     ${clip.scores.ctr}/100\n\n`;
      viralReport += `Decisão do Motor Esportivo:\n`;
      viralReport += `   ${clip.report.whySelected}\n\n`;
      viralReport += `Ideia de Thumbnail Recomendada:\n`;
      viralReport += `   - Texto: "${clip.thumbnail.text}"\n`;
      viralReport += `   - Layout Visual: ${clip.thumbnail.layoutDescription}\n\n`;
    });
    zip.addFile("Relatorio_Viralizacao.txt", Buffer.from(viralReport, "utf-8"));

    // 6. Relatório de Retenção
    let retentionReport = `======================================================================\n`;
    retentionReport += `             RELATÓRIO DE RETENÇÃO E ENGAJAMENTO PSICOLÓGICO\n`;
    retentionReport += `======================================================================\n`;
    analysis.clips.forEach((clip, index) => {
      retentionReport += `► CLIP 0${index + 1}: ${clip.title}\n`;
      retentionReport += `  - Retention Score: ${clip.scores.retention}/100\n`;
      retentionReport += `  - Emoção Dominante Detectada: ${clip.report.emotionDetected}\n`;
      retentionReport += `  - Potencial Geral de Retenção: ${clip.report.retentionPotential}\n`;
      retentionReport += `  - Potencial de Compartilhamento WhatsApp/Telegram: ${clip.report.sharingPotential}\n\n`;
    });
    zip.addFile("Relatorio_Retencao.txt", Buffer.from(retentionReport, "utf-8"));

    const zipBuffer = zip.toBuffer();
    res.setHeader("Content-Disposition", `attachment; filename="FUTSHORTS_COMPLETE_KIT_${matchId}.zip"`);
    res.setHeader("Content-Type", "application/zip");
    res.send(zipBuffer);

  } catch (error: any) {
    res.status(500).json({ error: "Erro ao gerar kit completo: " + error.message });
  }
});


// ---------------------- FRONTEND / VITE MIDDLEWARE SETUP ----------------------

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
