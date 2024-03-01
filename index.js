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
document.querySelector("input#subnetmask").oninput = (e) => {
    e.target.value = e.target.value.replace(/[^0-25\.]/g, "");
}

document.querySelector("button.calc").onclick = () => {
    const button = document.querySelector("button.calc");
    const ipAddress = document.querySelector('input#ipadress').value;
    const subnetmask = document.querySelector('input#subnetmask').value || document.querySelector('input#subnetmask').placeholder;
    
    // Verif input
    if (!ipAddress || !subnetmask) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    
    // Verif IP
    if (!isValidIP(ipAddress)) {
        alert("Adresse IP invalide.");
        return;
    }
    
    // Vérif Masque réseau
    if (!isValidSubnetMask(subnetmask)) {
        alert("Masque de sous-réseau invalide.");
        return;
    }
    
    document.querySelector("#container").classList.add("disabled");
    var firstHostArray = ipAddress.split('.').map((octet, index) => octet & subnetmask.split('.')[index]).slice();  
    firstHostArray[3]++;
    
    var lastHostArray = ipAddress.split('.').map((octet, index) => (octet & subnetmask.split('.')[index]) | (~subnetmask.split('.')[index] & 255)).slice();  
    lastHostArray[3]--;
    
    document.querySelector("#results").style.display = "flex";
    document.querySelector("#results > p#ipadress").innerText = `Adresse IP: ${ipAddress}`;
    document.querySelector("#results > p#subnetmask").innerText = `Masque sous réseaux: ${subnetmask}`;
    document.querySelector("#results > p#netadress").innerText = `Adresse Réseaux: ${ipAddress.split('.').map((octet, index) => octet & subnetmask.split('.')[index]).join('.')}`;
    document.querySelector("#results > p#firstnetadress").innerText = `Première Adresse IP du réseaux: ${firstHostArray.join('.')}`;
    document.querySelector("#results > p#secondnetadress").innerText = `Dernière Adresse IP du réseaux: ${lastHostArray.join('.')}`;
    document.querySelector("#results > p#broadcast").innerText = `Adresse de diffusion: ${ipAddress.split('.').map((octet, index) => (octet & subnetmask.split('.')[index]) | (~subnetmask.split('.')[index] & 255)).join('.')}`;
    document.querySelector("#results > p#cird").innerText = `CIRD: ${subnetmask.split('.').map(Number).reduce((count, octet) => count + octet.toString(2).split('1').length - 1, 0)}`;
    document.querySelector("#results > p#class").innerText = `Class: /${calculateIPClass(ipAddress.split('.')[0])}`;
}
document.querySelector("button.close").onclick = () => {
    document.querySelector("#results").style.display = "none";
    document.querySelector("#container").classList.remove("disabled");
}

function isValidIP(ip) {
    var ipRegex = /^(\d{1,3}\.){3}(\d{1,3})$/;
    if (!ipRegex.test(ip)) return false;
    let valid = true;
    ip.split(".").forEach((octet) => {
        if (octet > 255) valid = false;
    });
    return valid;
}

function isValidSubnetMask(subnetmask) {
    let valid = true;
    subnetmask.split('.').forEach((octet) => {
        if (octet === "255" || octet === "0") return;
        valid = false;
    });
    return valid;
}

function calculateIPClass(firstOctet) {
    if (firstOctet >= 1 && firstOctet <= 126) return "A";
    if (firstOctet >= 128 && firstOctet <= 191) return "B";
    if (firstOctet >= 192 && firstOctet <= 223) return "C";
    if (firstOctet >= 224 && firstOctet <= 239) return "D";
    if (firstOctet >= 240 && firstOctet <= 255) return "E";
    return "Unknown";
}