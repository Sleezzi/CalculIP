document.querySelectorAll("input").forEach(input => {
    input.onkeydown = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            if (e.target.value.slice(e.target.value.length-1, e.target.value.length) === ".") {
                e.target.value = e.target.value.slice(0, e.target.value.length-1);
            }
        }
    }
});
document.querySelector("input#ipadress").oninput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9\.]/g, "");
    
    if (e.target.value.length === 3) {
        e.target.value = `${e.target.value.slice(0, 3)}.`;
    }
    if (e.target.value.length === 7) {
        e.target.value = `${e.target.value.slice(0, 3)}.${e.target.value.slice(4, 7)}.`;
    }
    if (e.target.value.length === 10) {
        e.target.value = `${e.target.value.slice(0, 3)}.${e.target.value.slice(4, 7)}.${e.target.value.slice(8, 10)}.${e.target.value.slice(11, e.target.value.length)}`;
    }
}


function redirigerVersLien(lien) {
    var base_url = 'BASE_URL';
    var url;

    switch (lien) {
        case 'lien_adresse_ip':
            url = 'https://www.jechange.fr/telecom/internet/adresse-ip';
            break;
        case 'lien_masque_reseau':
            url = 'https://www.cloudflare.com/fr-fr/learning/network-layer/what-is-a-subnet/';
            break;
        default:
            url = base_url;
    }

    // Redirection vers le lien spécifi
    window.location.href = url;
}

document.querySelector("button").onclick = () => {
    var button = document.querySelector("button");
    var ipAddress = document.querySelector('input#ipadress').value;
    var subnetMask = document.querySelector('input#subnetMask').value;

    if (button.innerHTML === 'Calculer') {
        // Annuler
        button.style.backgroundColor = '#ff5050';
        button.innerHTML = 'Annuler';

        // Verif input
        if (!ipAddress || !subnetMask) {
            alert("Veuillez remplir tous les champs.");
            resetCalculateButton();
            return;
        }

        // Verif IP
        if (!isValidIP(ipAddress)) {
            alert("Adresse IP invalide.");
            resetCalculateButton();
            return;
        }

        // Vérif Masque réseau
        if (!isValidSubnetMask(subnetMask)) {
            alert("Masque de sous-réseau invalide.");
            resetCalculateButton();
            return;
        }

        var firstHostArray = ipAddress.split('.').map(Number).map((octet, index) => octet & subnetMask.split('.').map(Number)[index]).slice();  
        firstHostArray[3]++;  

        var lastHostArray = ipAddress.split('.').map(Number).map((octet, index) => (octet & subnetMask.split('.').map(Number)[index]) | (~subnetMask.split('.').map(Number)[index] & 255)).slice();  
        lastHostArray[3]--;  

        document.querySelector("#results > p#ipadress").innerText = `Adress IP: ${ipAddress}`;
        document.querySelector("#results > p#subnetmask").innerText = `Masque sous réseaux: ${subnetMask}`;
        document.querySelector("#results > p#netadress").innerText = `Adress Réseaux: ${ipAddress.split('.').map(Number).map((octet, index) => octet & subnetMask.split('.').map(Number)[index]).join('.')}`;
        document.querySelector("#results > p#firstnetadress").innerText = `Première Adress IP du réseaux: ${firstHostArray.join('.')}`;
        document.querySelector("#results > p#secondnetadress").innerText = `Dernière Adress IP du réseaux: ${lastHostArray.join('.')}`;
        document.querySelector("#results > p#broadcast").innerText = `Adress de diffusion: ${ipAddress.split('.').map(Number).map((octet, index) => (octet & subnetMask.split('.').map(Number)[index]) | (~subnetMask.split('.').map(Number)[index] & 255)).join('.')}`;
        document.querySelector("#results > p#cird").innerText = `CIRD: ${subnetMask.split('.').map(Number).reduce((count, octet) => count + octet.toString(2).split('1').length - 1, 0)}`;
        document.querySelector("#results > p#class").innerText = `Class: /${calculateIPClass(ipAddress.split('.').map(Number)[0])}`;
        // document.getElementById('results').innerText = results;
        // document.getElementById('calculator').classList.add('results-shown');

    } else if (button.innerHTML === 'Annuler') {
        resetCalculateButton();
        document.getElementById('results').innerHTML = '';

        document.getElementById('calculator').classList.remove('results-shown');
    }
}

function resetCalculateButton() {
    var button = document.getElementById('calculateButton');
    button.style.backgroundColor = '#2c9b00';
    button.innerHTML = 'Calculer';
}

function isValidIP(ip) {
    var ipRegex = /^(\d{1,3}\.){3}(\d{1,3})$/;
    return ipRegex.test(ip);
}

function isValidSubnetMask(subnetMask) {
    var subnetRegex = /^(\d{1,3}\.){3}(\d{1,3})$/;
    if (!subnetRegex.test(subnetMask)) {
        return false;
    }
    var subnetArray = subnetMask.split('.').map(Number);
    return subnetArray.every(function (octet) {
        return octet === 0 || octet === 128 || octet === 192 || octet === 224 || octet === 240 || octet === 248 || octet === 252 || octet === 254 || octet === 255;
    });
}

function calculateIPClass(firstOctet) {
    if (firstOctet >= 1 && firstOctet <= 126) {
        return "A";
    } else if (firstOctet >= 128 && firstOctet <= 191) {
        return "B";
    } else if (firstOctet >= 192 && firstOctet <= 223) {
        return "C";
    } else if (firstOctet >= 224 && firstOctet <= 239) {
        return "D";
    } else if (firstOctet >= 240 && firstOctet <= 255) {
        return "E";
    } else {
        return "Unknown";
    }
    }
