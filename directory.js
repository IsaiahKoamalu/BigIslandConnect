const token = 'patNUTaHMpct1jzwV.f9d140a28f572574cf98f1edee6c10f2d6b2fd173c10d7103492ce7381418be7'
const baseId = 'appFyhg6zdmR5iJBn';
const tableName = 'SkillsDirectory';

const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
let allRecords = [];

fetch(url, {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
    .then(res => res.json())
    .then(data => {
        allRecords = data.records;
        renderDirectory(allRecords);
    })
    .catch(err => {
        console.error('Error loading Airtable data:', err);
    });

function renderDirectory(records) {
    const container = document.getElementById('directory-list');
    container.innerHTML = '';

    records.forEach(record => {
        const fields = record.fields;
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = ` 
      <h3>${fields.Name || 'Anonymous'}</h3>
      <p><strong>Email:</strong> ${fields.Email || '—'}</p>
      <p><strong>Offers:</strong> ${fields['Skills Offered'] || '—'}</p>
      <p><strong>Needs:</strong> ${fields['Skills Needed'] || '—'}</p>
      <p><strong>Location:</strong> ${fields['City or Zip Code'] || '—'}</p>
      <form onsubmit="sendMessage(event, '${fields.Email}', '${fields.Name}')">
        <textarea name="message" placeholder="Write your message..." required></textarea>
        <input type="email" name="replyTo" placeholder="Your email" required>
        <button type="submit">Send</button>
      </form>
    `;
        container.appendChild(card);
    });
}

document.getElementById('search-input').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();

    const filtered = allRecords.filter(record => {
        const f = record.fields;
        return (
            (f.Name && f.Name.toLowerCase().includes(query)) ||
            (f['Skills Offered'] && f['Skills Offered'].toLowerCase().includes(query)) ||
            (f['Skills Needed'] && f['Skills Needed'].toLowerCase().includes(query)) ||
            (f['City or Zip Code'] && f['City or Zip Code'].toLowerCase().includes(query))
        );
    });

    renderDirectory(filtered);
});

function sendMessage(event, recipientEmail, recipientName) {
    event.preventDefault();
    const form = event.target;
    const message = form.message.value;
    const replyTo = form.replyTo.value;

    fetch('/.netlify/functions/sendMessage', {
        method: 'POST',
        body: JSON.stringify({
            message,
            replyTo,
            recipientEmail,
            senderName: recipientName
        })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message || 'Message sent!');
            form.reset();
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong.');
        });
}