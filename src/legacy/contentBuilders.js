export function hero(title, pills, bodyHtml) {
  return {
    kind: 'hero',
    title,
    pills,
    html: bodyHtml
  };
}

export function panel(title, html) {
  return {
    kind: 'panel',
    title,
    html
  };
}

function renderList(items = []) {
  return items.map(item => `<li>${item}</li>`).join('');
}

function renderAnnotationItems(items = []) {
  return items
    .map(item => `
      <div class="annotation-item">
        <h4>${item.title}</h4>
        <p>${item.body}</p>
      </div>
    `)
    .join('');
}

function renderTimeline(steps = []) {
  return steps
    .map(
      (step, index) => `<div class="step"><strong>${index + 1}.</strong> ${step}</div>`
    )
    .join('');
}

export function teachingTask({
  task,
  thinkFirst = [],
  codeId,
  codeKicker = 'Worked solution',
  codeTitle = 'Fully worked code solution',
  code,
  explanation = [],
  pipeline = [],
  spring = [],
  android = [],
  mistakes = [],
  better = ''
}) {
  const explanationHtml = explanation.length
    ? `
      <div>
        <div class="kicker">Block-by-block explanation</div>
        <div class="annotation-list">
          ${renderAnnotationItems(explanation)}
        </div>
      </div>
    `
    : '';

  const pipelineHtml = pipeline.length
    ? `
      <div>
        <div class="kicker">Pipeline / architecture explanation</div>
        <div class="timeline">
          ${renderTimeline(pipeline)}
        </div>
      </div>
    `
    : '';

  const springHtml = spring.length
    ? `
      <div class="compare-card do">
        <h3>Spring Boot mapping</h3>
        <ul class="lesson-checklist">${renderList(spring)}</ul>
      </div>
    `
    : '';

  const androidHtml = android.length
    ? `
      <div class="compare-card do">
        <h3>Android / Hilt / Room / DAO / Retrofit mapping</h3>
        <ul class="lesson-checklist">${renderList(android)}</ul>
      </div>
    `
    : '';

  const mistakesHtml = mistakes.length
    ? `
      <div class="compare-card dont">
        <h3>Common mistakes</h3>
        <ul class="lesson-checklist">${renderList(mistakes)}</ul>
      </div>
    `
    : '';

  const betterHtml = better
    ? `
      <div class="compare-card do">
        <h3>Why this solution is better than alternatives</h3>
        <p>${better}</p>
      </div>
    `
    : '';

  return `
    <div class="compare-grid">
      <div class="compare-card do">
        <h3>Task</h3>
        <p>${task}</p>
      </div>
      <div class="compare-card">
        <h3>Think first</h3>
        <ul class="lesson-checklist">${renderList(thinkFirst)}</ul>
      </div>
    </div>
    <div class="code-card">
      <div class="code-head">
        <div>
          <div class="kicker">${codeKicker}</div>
          <strong>${codeTitle}</strong>
        </div>
        ${codeId ? `<button class="copy-btn" data-copy-target="${codeId}">Copy snippet</button>` : ''}
      </div>
      <pre${codeId ? ` id="${codeId}"` : ''}>${code}</pre>
    </div>
    ${explanationHtml}
    ${pipelineHtml}
    <div class="compare-grid">
      ${springHtml}
      ${androidHtml}
    </div>
    <div class="compare-grid">
      ${mistakesHtml}
      ${betterHtml}
    </div>
  `;
}

