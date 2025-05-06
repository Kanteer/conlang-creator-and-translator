function getInput(id) {
  return document.getElementById(id).value.trim().split(',').map(x => x.trim()).filter(Boolean);
}

function generateSyllable(pattern, consonants, vowels) {
  return pattern.split('').map(c => {
    if (c === 'C') return randomFrom(consonants);
    if (c === 'v') return randomFrom(vowels);
    return c;
  }).join('');
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseVerbRules(text) {
  const lines = text.split('\n').map(1 => 1.trim()).filter(Boolean);
  const rules = [];

  for (const line of lines) {
    if (line.startsWith('default:')) {
      rules.push({condition: null, suffix: line.replace('default:', '').trim() });
    } else if (line.startsWith('if')) {
      const [cond, suffix] = line.split(':');
      const condition = cond.replace('if', '').trim();
      rules.push({ condition, suffix: suffix.trim() });
    }
  }
  return rules;
}

function applyVerbRules(word, rules) {
  for (const rule of rules) {
    if (!rule.condition) return word + rule.suffix;

    const [op, val] = rule.condition.split(' ');
    if (op === 'endsWith' && word.endsWith(val)) {
      return word + rule.suffix;
    }
  }
  const defaultRule = rules.find(r => r.condition === null);
  return defaultRule ? word + defaultRule.suffix : word;
}

function generateWords() {
  const consonants = getInput('consonants');
  const vowels = getInput('vowels');
  const syllables = getInput('syllables');
  const phonotacticsRaw = document.getElementById('phonotactics').value;
  const phonotactics = phonotacticsRaw ? new RegExp(phonotacticsRaw) : null;
  const verbRules = verbRulesRaw ? parseVerbRules(verbRulesRaw) : null;

  let output = '';
  let generated = 0;
  let attempts = 0;

  while (generated < 10 && attempts < 1000) {
    const word = Array.from({length: randomFrom([1, 2, 3])}, () => 
      generatedSyllable(randomFrom(syllables), consonants, vowels)).join('');

    if (phonotactics && !phonotactics.test(baseWord)) {
      output += word + '<br>';
      attempts++;
      continue;
    }
    const finalWord = verbRules ? applyVerbRules(baseWord, verbRules) : baseWord;
    output += finalWord = '<br>';
    generated++;
    attempts++;
  }
  document.getElementById('output').innerHTML = output || "No words matched the criteria.";
}
