import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  category: 'presidential' | 'congress' | 'district';
  image?: string;
}

interface PDFData {
  totalVoters: number;
  totalVotes: number;
  participation: number;
  presidential: Candidate[];
  congress: Candidate[];
  district: Candidate[];
}

export const generateElectionPDF = (data: PDFData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Colores corporativos - using tuples with 'as const' for proper typing
  const colors = {
    primary: [99, 102, 241] as [number, number, number],
    secondary: [139, 92, 246] as [number, number, number],
    success: [34, 197, 94] as [number, number, number],
    accent: [236, 72, 153] as [number, number, number],
    dark: [15, 23, 42] as [number, number, number],
    light: [241, 245, 249] as [number, number, number],
    gold: [234, 179, 8] as [number, number, number],
    orange: [249, 115, 22] as [number, number, number],
    blue: [59, 130, 246] as [number, number, number],
  };

  let yPosition = 20;

  // ====== HEADER CON DISEÑO MODERNO ======
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setFillColor(...colors.secondary);
  doc.circle(10, 10, 8, 'F');
  doc.circle(pageWidth - 10, 10, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RESULTADOS FINALES', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Elecciones 2024 - Reporte Oficial', pageWidth / 2, 30, { align: 'center' });
  
  const currentDate = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFontSize(9);
  doc.text(currentDate, pageWidth / 2, 38, { align: 'center' });

  yPosition = 55;

  // ====== ESTADÍSTICAS GENERALES (Cards) ======
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Estadísticas Generales', 15, yPosition);
  
  yPosition += 10;

  const cardWidth = (pageWidth - 40) / 3;
  const cardHeight = 25;
  const cardSpacing = 5;

  // Card 1: Total Votantes
  doc.setFillColor(...colors.light);
  doc.roundedRect(15, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, yPosition, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Total Votantes', 15 + cardWidth / 2, yPosition + 8, { align: 'center' });
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text(data.totalVoters.toString(), 15 + cardWidth / 2, yPosition + 18, { align: 'center' });

  // Card 2: Total Votos
  doc.setFillColor(...colors.light);
  doc.roundedRect(15 + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(...colors.secondary);
  doc.roundedRect(15 + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Total Votos', 15 + cardWidth + cardSpacing + cardWidth / 2, yPosition + 8, { align: 'center' });
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.secondary);
  doc.text(data.totalVotes.toString(), 15 + cardWidth + cardSpacing + cardWidth / 2, yPosition + 18, { align: 'center' });

  // Card 3: Participación
  doc.setFillColor(...colors.light);
  doc.roundedRect(15 + (cardWidth + cardSpacing) * 2, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(...colors.success);
  doc.roundedRect(15 + (cardWidth + cardSpacing) * 2, yPosition, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Participación', 15 + (cardWidth + cardSpacing) * 2 + cardWidth / 2, yPosition + 8, { align: 'center' });
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.success);
  doc.text(`${data.participation.toFixed(1)}%`, 15 + (cardWidth + cardSpacing) * 2 + cardWidth / 2, yPosition + 18, { align: 'center' });

  yPosition += cardHeight + 15;

  // ====== GRÁFICO: VOTOS POR CATEGORÍA (BARRAS) ======
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Votos por Categoría', 15, yPosition);
  
  yPosition += 10;

  const chartX = 25;
  const chartY = yPosition;
  const chartWidth = pageWidth - 50;
  const chartHeight = 50;

  // Calcular votos totales por categoría
  const categoryVotes = {
    presidential: data.presidential.reduce((sum, c) => sum + c.votes, 0),
    congress: data.congress.reduce((sum, c) => sum + c.votes, 0),
    district: data.district.reduce((sum, c) => sum + c.votes, 0)
  };

  const maxVotes = Math.max(categoryVotes.presidential, categoryVotes.congress, categoryVotes.district);
  const barWidth = (chartWidth - 60) / 3;
  const barSpacing = 10;

  // Fondo del gráfico
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(chartX - 5, chartY, chartWidth + 10, chartHeight + 20, 2, 2, 'F');

  // Líneas de guía horizontales
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  for (let i = 0; i <= 4; i++) {
    const lineY = chartY + chartHeight - (chartHeight * i / 4);
    doc.line(chartX, lineY, chartX + chartWidth, lineY);
  }

  // Barra Presidencial
  const presidentialHeight = (categoryVotes.presidential / maxVotes) * chartHeight;
  doc.setFillColor(...colors.primary);
  doc.roundedRect(chartX + 15, chartY + chartHeight - presidentialHeight, barWidth, presidentialHeight, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(categoryVotes.presidential.toString(), chartX + 15 + barWidth / 2, chartY + chartHeight - presidentialHeight - 2, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Presidencial', chartX + 15 + barWidth / 2, chartY + chartHeight + 8, { align: 'center' });

  // Barra Congresistas
  const congressHeight = (categoryVotes.congress / maxVotes) * chartHeight;
  doc.setFillColor(...colors.secondary);
  doc.roundedRect(chartX + 15 + barWidth + barSpacing, chartY + chartHeight - congressHeight, barWidth, congressHeight, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...colors.secondary);
  doc.setFont('helvetica', 'bold');
  doc.text(categoryVotes.congress.toString(), chartX + 15 + barWidth + barSpacing + barWidth / 2, chartY + chartHeight - congressHeight - 2, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Congresistas', chartX + 15 + barWidth + barSpacing + barWidth / 2, chartY + chartHeight + 8, { align: 'center' });

  // Barra Distrital
  const districtHeight = (categoryVotes.district / maxVotes) * chartHeight;
  doc.setFillColor(...colors.accent);
  doc.roundedRect(chartX + 15 + (barWidth + barSpacing) * 2, chartY + chartHeight - districtHeight, barWidth, districtHeight, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...colors.accent);
  doc.setFont('helvetica', 'bold');
  doc.text(categoryVotes.district.toString(), chartX + 15 + (barWidth + barSpacing) * 2 + barWidth / 2, chartY + chartHeight - districtHeight - 2, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Distrital', chartX + 15 + (barWidth + barSpacing) * 2 + barWidth / 2, chartY + chartHeight + 8, { align: 'center' });

  yPosition += chartHeight + 30;

  // ====== GRÁFICO: DISTRIBUCIÓN PORCENTUAL (BARRAS HORIZONTALES) ======
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Distribución por Categoría', 15, yPosition);
  
  yPosition += 10;

  const totalAllVotes = categoryVotes.presidential + categoryVotes.congress + categoryVotes.district;
  
  if (totalAllVotes > 0) {
    const percentages = {
      presidential: (categoryVotes.presidential / totalAllVotes) * 100,
      congress: (categoryVotes.congress / totalAllVotes) * 100,
      district: (categoryVotes.district / totalAllVotes) * 100
    };

    const barChartX = 30;
    const barChartWidth = pageWidth - 60;
    const barHeight = 12;
    const barSpacing = 8;

    // Barra Presidencial
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barChartX, yPosition, barChartWidth, barHeight, 2, 2, 'F');
    doc.setFillColor(...colors.primary);
    const presidentialBarWidth = (percentages.presidential / 100) * barChartWidth;
    if (presidentialBarWidth > 0) {
      doc.roundedRect(barChartX, yPosition, presidentialBarWidth, barHeight, 2, 2, 'F');
    }
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('Presidencial', barChartX - 2, yPosition + 8, { align: 'right' });
    doc.setTextColor(...colors.primary);
    doc.text(`${percentages.presidential.toFixed(1)}%`, barChartX + barChartWidth + 5, yPosition + 8);

    yPosition += barHeight + barSpacing;

    // Barra Congresistas
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barChartX, yPosition, barChartWidth, barHeight, 2, 2, 'F');
    doc.setFillColor(...colors.secondary);
    const congressBarWidth = (percentages.congress / 100) * barChartWidth;
    if (congressBarWidth > 0) {
      doc.roundedRect(barChartX, yPosition, congressBarWidth, barHeight, 2, 2, 'F');
    }
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('Congresistas', barChartX - 2, yPosition + 8, { align: 'right' });
    doc.setTextColor(...colors.secondary);
    doc.text(`${percentages.congress.toFixed(1)}%`, barChartX + barChartWidth + 5, yPosition + 8);

    yPosition += barHeight + barSpacing;

    // Barra Distrital
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barChartX, yPosition, barChartWidth, barHeight, 2, 2, 'F');
    doc.setFillColor(...colors.accent);
    const districtBarWidth = (percentages.district / 100) * barChartWidth;
    if (districtBarWidth > 0) {
      doc.roundedRect(barChartX, yPosition, districtBarWidth, barHeight, 2, 2, 'F');
    }
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('Distrital', barChartX - 2, yPosition + 8, { align: 'right' });
    doc.setTextColor(...colors.accent);
    doc.text(`${percentages.district.toFixed(1)}%`, barChartX + barChartWidth + 5, yPosition + 8);

    yPosition += barHeight + 10;
  }

  yPosition += 10;

  // ====== FUNCIÓN PARA CREAR SECCIÓN DE CATEGORÍA ======
  const createCategorySection = (
    title: string,
    icon: string,
    candidates: Candidate[],
    color: [number, number, number],
    startY: number
  ): number => {
    let y = startY;

    if (y > pageHeight - 80) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(...color);
    doc.roundedRect(15, y, pageWidth - 30, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, y + 7);
    
    y += 15;

    if (candidates.length === 0) {
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('No hay candidatos en esta categoría', 20, y);
      return y + 10;
    }

    const winner = candidates[0];
    const totalVotesCategory = candidates.reduce((sum, c) => sum + c.votes, 0);
    const winnerPercentage = totalVotesCategory > 0 ? (winner.votes / totalVotesCategory * 100).toFixed(1) : '0.0';

    doc.setFillColor(...colors.gold);
    doc.roundedRect(15, y, pageWidth - 30, 20, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('★ GANADOR', 20, y + 7);
    
    doc.setFontSize(13);
    doc.text(winner.name, 20, y + 14);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(winner.party, 20, y + 19);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    const votesText = `${winner.votes} votos`;
    const votesWidth = doc.getTextWidth(votesText);
    doc.text(votesText, pageWidth - 20 - votesWidth, y + 10);
    
    doc.setFontSize(12);
    const percentText = `${winnerPercentage}%`;
    const percentWidth = doc.getTextWidth(percentText);
    doc.text(percentText, pageWidth - 20 - percentWidth, y + 17);

    y += 25;

    const tableData = candidates.map((candidate, index) => {
      const percentage = totalVotesCategory > 0 ? (candidate.votes / totalVotesCategory * 100).toFixed(1) : '0.0';
      return [
        `${index + 1}º`,
        candidate.name,
        candidate.party,
        candidate.votes.toString(),
        `${percentage}%`
      ];
    });

    autoTable(doc, {
      startY: y,
      head: [['Pos.', 'Candidato', 'Partido', 'Votos', '%']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: color,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [50, 50, 50]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { halign: 'left', cellWidth: 50 },
        2: { halign: 'left', cellWidth: 45 },
        3: { halign: 'center', cellWidth: 25 },
        4: { halign: 'center', cellWidth: 20 }
      },
      margin: { left: 15, right: 15 },
      didParseCell: (data) => {
        if (data.row.index === 0 && data.section === 'body') {
          data.cell.styles.fillColor = [254, 249, 195];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    return (doc as any).lastAutoTable.finalY + 10;
  };

  yPosition = createCategorySection(
    'Elección Presidencial',
    '',
    data.presidential,
    colors.primary,
    yPosition
  );

  yPosition = createCategorySection(
    'Elección de Congresistas',
    '',
    data.congress,
    colors.secondary,
    yPosition
  );

  yPosition = createCategorySection(
    'Elección Distrital',
    '',
    data.district,
    colors.accent,
    yPosition
  );

  // Footer en todas las páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...colors.dark);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(
      `Sistema de Votación Electoral - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );
    
    doc.text(
      '© 2024 Todos los derechos reservados',
      pageWidth / 2,
      pageHeight - 3,
      { align: 'center' }
    );
  }

  const fileName = `Resultados_Elecciones_${new Date().getFullYear()}.pdf`;
  doc.save(fileName);
};