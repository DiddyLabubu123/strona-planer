
class Zadanie {
    constructor(id, tresc, priorytet) {
        this.id = id;
        this.tresc = tresc;
        this.priorytet = priorytet;
        this.czyZrobione = false;
    }
}


class MojaAplikacja {
    constructor() {
        
        const daneZPamieci = localStorage.getItem('zadaniaSigmy');
        this.zadania = daneZPamieci ? JSON.parse(daneZPamieci) : [];
        this.aktualnyFiltr = 'wszystkie';

        
        this.listaUI = document.getElementById('listaZadan');
        this.poleTekstowe = document.querySelector('#poleZadania');
        this.wyborWaznosci = document.querySelector('#wyborPriorytetu');
        this.przyciskDodawania = document.getElementById('przyciskDodaj');
        this.licznikUI = document.getElementById('licznikZadan');

        this.uruchomZdarzenia();
        this.odswiezWidok();
    }

    uruchomZdarzenia() {
       
        this.przyciskDodawania.addEventListener('click', () => this.dodajNoweZadanie());

        
        const przyciskiFiltrow = document.querySelectorAll('.filtr-btn');
        przyciskiFiltrow.forEach(przycisk => {
            przycisk.addEventListener('click', (e) => {
                przyciskiFiltrow.forEach(p => p.classList.remove('aktywny'));
                e.target.classList.add('aktywny');
                this.aktualnyFiltr = e.target.dataset.typ;
                this.odswiezWidok();
            });
        });

        
        document.getElementById('wyczyscWszystko').addEventListener('click', () => {
            if(confirm("Na pewno usunąć wszystko?")) {
                this.zadania = [];
                this.zapiszIDzialaj();
            }
        });
    }

    dodajNoweZadanie() {
        const tekst = this.poleTekstowe.value;
        const priorytet = this.wyborWaznosci.value;

        if (tekst.length < 3) {
            alert("Wpisz przynajmniej 3 znaki!");
            return;
        }

        const nowe = new Zadanie(Date.now(), tekst, priorytet);
        this.zadania.push(nowe);
        this.poleTekstowe.value = ''; 
        this.zapiszIDzialaj();
    }

    zmienStatus(idZadania) {
        this.zadania = this.zadania.map(z => {
            if (z.id === idZadania) {
                z.czyZrobione = !z.czyZrobione;
            }
            return z;
        });
        this.zapiszIDzialaj();
    }

    usunZadanie(idZadania) {
        this.zadania = this.zadania.filter(z => z.id !== idZadania);
        this.zapiszIDzialaj();
    }

    zapiszIDzialaj() {
        localStorage.setItem('zadaniaSigmy', JSON.stringify(this.zadania));
        this.odswiezWidok();
    }

    odswiezWidok() {
        this.listaUI.innerHTML = '';
        
        
        let zadaniaDoPokazania = this.zadania;
        if (this.aktualnyFiltr === 'w-toku') {
            zadaniaDoPokazania = this.zadania.filter(z => !z.czyZrobione);
        } else if (this.aktualnyFiltr === 'zrobione') {
            zadaniaDoPokazania = this.zadania.filter(z => z.czyZrobione);
        }

        
        zadaniaDoPokazania.forEach(z => {
            const li = document.createElement('li');
            li.className = `element-listy ${z.priorytet} ${z.czyZrobione ? 'zrobione' : ''}`;
            
            li.innerHTML = `
                <span>${z.tresc}</span>
                <div class="przyciski-akcji">
                    <button class="status-btn">${z.czyZrobione ? 'Cofnij' : 'Gotowe'}</button>
                    <button class="usun-btn">Usuń</button>
                </div>
            `;

            
            li.querySelector('.status-btn').onclick = () => this.zmienStatus(z.id);
            li.querySelector('.usun-btn').onclick = () => this.usunZadanie(z.id);

            this.listaUI.appendChild(li);
        });

        this.licznikUI.innerText = this.zadania.length;
    }
}


const start = new MojaAplikacja();