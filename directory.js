const token = 'patNUTaHMpct1jzwV.f9d140a28f572574cf98f1edee6c10f2d6b2fd173c10d7103492ce7381418be7'
const baseId = 'appFyhg6zdmR5iJBn';
const tableName = 'SkillsDirectory';

const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

fetch(url, {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
    .then(res => res.json())
    .then(data => {
        const records = data.records;
        const container = document.getElementById('directory-list');

        records.forEach(record => {
            const fields = record.fields;
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
        <h3>${fields.Name || 'Anonymous'}</h3>
        <p><strong>Email:</strong> ${fields['Email'] || '—'}</p>
        <p><strong>Offers:</strong> ${fields['Skills Offered'] || '—'}</p>
        <p><strong>Needs:</strong> ${fields['Skills Needed'] || '—'}</p>
        <p><strong>Location:</strong> ${fields['City or Zip Code'] || '—'}</p>
      `;
            container.appendChild(card);
        });
    })
    .catch(err => {
        console.error('Error loading Airtable data:', err);
    });