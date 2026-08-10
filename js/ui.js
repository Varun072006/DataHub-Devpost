/**
 * UI Renderer & DOM Controller (White Royal Theme Edition)
 */

export function updateMetricsUI(state) {
  if (!state) return;

  const riskPct = Math.round(state.risk * 100);
  const stabPct = Math.round(state.stability * 100);

  // Risk Score & Bar
  const riskValue = document.getElementById('riskValue');
  const riskBar = document.getElementById('riskBar');
  riskValue.textContent = `${riskPct}%`;
  riskBar.style.width = `${riskPct}%`;

  if (riskPct >= 70) {
    riskBar.style.backgroundColor = '#dc2626';
    riskValue.style.color = '#dc2626';
  } else if (riskPct >= 45) {
    riskBar.style.backgroundColor = '#d97706';
    riskValue.style.color = '#d97706';
  } else {
    riskBar.style.backgroundColor = '#059669';
    riskValue.style.color = '#059669';
  }

  // Trend
  const trendEl = document.getElementById('trendIndicator');
  if (state.trend === 'increasing') {
    trendEl.textContent = '↑ INCREASING';
    trendEl.style.color = '#dc2626';
  } else if (state.trend === 'decreasing') {
    trendEl.textContent = '↓ DECREASING';
    trendEl.style.color = '#059669';
  } else {
    trendEl.textContent = '→ STABLE';
    trendEl.style.color = '#64748b';
  }

  // Stability
  document.getElementById('stabilityValue').textContent = `${stabPct}%`;
  document.getElementById('stabilityBar').style.width = `${stabPct}%`;

  // Posture Pill
  const posturePill = document.getElementById('posturePill');
  posturePill.textContent = state.posture.toUpperCase();
  posturePill.className = 'status-pill ' + (state.posture === 'critical' ? 'critical' : state.posture === 'unstable' || state.posture === 'leaning' ? 'warning' : '');

  // Kinematics
  document.getElementById('torsoAngleVal').textContent = `${state.torsoAngle}° (${state.torsoAngle > 10 ? 'Tilted' : 'Vertical'})`;
  document.getElementById('kneeLeftVal').textContent = `${state.kneeAngle.left}°`;
  document.getElementById('kneeRightVal').textContent = `${state.kneeAngle.right}°`;
  document.getElementById('velocityVal').textContent = `${state.movementVelocity} (${state.movementVelocity > 0.05 ? 'Irregular' : 'Smooth'})`;
}

export function animateStepChips(stepIndex) {
  const chips = document.querySelectorAll('.step-chip');
  chips.forEach((chip, idx) => {
    if (idx < stepIndex) {
      chip.className = 'step-chip completed';
    } else if (idx === stepIndex) {
      chip.className = 'step-chip active';
    } else {
      chip.className = 'step-chip';
    }
  });
}

/**
 * Utility: Converts Markdown text from LLM into clean, structured HTML
 */
function formatMarkdownToHTML(text) {
  if (!text) return '';

  let formatted = text
    // Replace headings (#### and ###)
    .replace(/####\s*(.*?)(?=\n|$)/g, '<h5 class="reasoning-heading">$1</h5>')
    .replace(/###\s*(.*?)(?=\n|$)/g, '<h4 class="reasoning-title">$1</h4>')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Code ticks
    .replace(/`(.*?)`/g, '<code class="reasoning-code">$1</code>')
    // Bullet points (- or *)
    .replace(/^[-\*]\s+(.*)$/gm, '<li class="reasoning-item">$1</li>')
    // Numbered items
    .replace(/^\d+\.\s+(.*)$/gm, '<li class="reasoning-item">$1</li>');

  // Wrap lists in <ul>
  formatted = formatted.replace(/(<li class="reasoning-item">.*?<\/li>\s*)+/gs, '<ul class="reasoning-list">$&</ul>');

  // Convert double newlines into clean paragraph blocks
  const paragraphs = formatted.split(/\n\s*\n/);
  return paragraphs.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<ul')) return p;
    return `<p class="reasoning-paragraph">${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

export function renderInvestigationReport(report) {
  const container = document.getElementById('investigationContent');
  document.getElementById('reportTimestamp').textContent = new Date().toLocaleTimeString();

  const riskPct = Math.round(report.riskScore * 100);
  const formattedReasoning = formatMarkdownToHTML(report.llmExplanation);

  let html = `
    <div class="report-container">
      <div class="alert-banner ${report.riskLevel}">
        <span>${report.riskLevel === 'CRITICAL' ? '⚠️' : report.riskLevel === 'WARNING' ? '⚡' : '✓'}</span>
        <span>${report.status.replace(/_/g, ' ')} — Risk Index: ${riskPct}% (${report.trend.toUpperCase()})</span>
      </div>

      <div class="evidence-box">
        <div class="box-title">PHYSICAL MOTION EVIDENCE (MEDIA-PIPE BOUNDARY)</div>
        <ul class="evidence-list">
          ${report.observations.map(obs => `<li>${obs}</li>`).join('')}
        </ul>
      </div>

      <div class="llm-box">
        <div class="box-title">DATAHUB SENTINEL REASONING (${report.model.name} v${report.model.version})</div>
        <div class="reasoning-body">
          ${formattedReasoning}
        </div>
      </div>

      <div class="recommendation-box">
        <div class="box-title">RECOMMENDED ACTION & GOVERNANCE ACCOUNTABILITY</div>
        <p style="font-size: 0.9rem; color: #0f2b5c; font-weight: 700;">👉 ${report.recommendation}</p>
        <p style="font-size: 0.78rem; color: #64748b; margin-top: 6px;">
          Model Owner: <strong style="color: #0f2b5c;">${report.model.owner}</strong> | Agent Confidence: <strong style="color: #059669;">${Math.round(report.confidence * 100)}%</strong>
        </p>
        ${report.writeback ? `
          <div style="margin-top: 10px; font-size: 0.78rem; color: #059669; font-family: var(--font-mono); font-weight: 700; background: #ecfdf5; padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(5, 150, 105, 0.3);">
            ● INCIDENT RECORDED IN DATAHUB GRAPH: ${report.writeback.urn}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Render lineage nodes
  if (report.lineageChain) {
    renderLineageNodes(report.lineageChain);
  }
}

export function renderLineageNodes(chain) {
  const section = document.getElementById('lineageSection');
  const container = document.getElementById('lineageNodes');
  section.style.display = 'block';

  let html = '';
  chain.forEach((node, idx) => {
    html += `
      <div class="node-card">
        <span class="node-type">${node.type}</span>
        <span class="node-name">${node.name}</span>
        <span class="node-owner">${node.owner || 'HumanOS'}</span>
      </div>
    `;
    if (idx < chain.length - 1) {
      html += `<span class="arrow-icon">→</span>`;
    }
  });

  container.innerHTML = html;
}

export function showTrustModal(auditData) {
  const modal = document.getElementById('trustModal');
  const body = document.getElementById('trustModalBody');

  let html = `
    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px; line-height: 1.5;">
      DataHub lineage and governance check ensuring the ML prediction is fully auditable, PII-compliant, and traceable to verified model owners.
    </p>
  `;

  auditData.checks.forEach(check => {
    html += `
      <div class="audit-item">
        <div class="audit-label">
          <span>${check.label}</span>
          <span class="audit-status">✓ ${check.status}</span>
        </div>
        <div class="audit-detail">${check.detail}</div>
      </div>
    `;
  });

  html += `
    <div style="margin-top: 16px; padding: 14px; background: #fffbeb; border: 1px solid rgba(217, 119, 6, 0.3); border-radius: 10px;">
      <span style="font-size: 0.8rem; color: #b45309; font-weight: 800; font-family: var(--font-serif); letter-spacing: 0.5px;">KNOWN MODEL LIMITATION:</span>
      <p style="font-size: 0.82rem; color: #1e293b; margin-top: 4px; font-weight: 500;">${auditData.limitation}</p>
    </div>
  `;

  body.innerHTML = html;
  modal.classList.add('open');
}

export function hideTrustModal() {
  document.getElementById('trustModal').classList.remove('open');
}
