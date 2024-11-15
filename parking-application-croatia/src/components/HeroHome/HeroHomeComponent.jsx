import './HeroHomeComponent.css';

export default function HeroHomeComponent() {
    return (
        <>
            <div className="hero-container">
                <div className="hero-title">
                    <h1>
                        Brzo i <span className="green-text">jednostavno</span> parkiranje.
                    </h1>
                    <div className="store-buttons">
                        <a href="http://www.apple.com">
                            <img src="/assets/ios.png" className="store-button" alt="Apple store button" />
                        </a>
                        <a href="http://www.android.com">
                            <img src="/assets/android.png" className="store-button" alt="Google store button" />
                        </a>
                    </div>
                    <p>Najjednostavnije plaćanje parkinga koje možete pronaći!</p>
                </div>
                <div className="hero-title-image">
                    <img className='hero-image' src="/assets/heroImage.png" alt="" />
                </div>
            </div>
            <div className="info-containers">
                <div className='info-box'>
                    <div className='info-box-text'>
                        <h1>
                            Efikasno parkiranje uz samo par klikova
                        </h1>
                        <p>
                            Uživajte u jednostavnom i brzom parkiranju bez stresa! Naša aplikacija
                            vam omogućava da pronađete slobodna parking mesta, rezervišete unapred i
                            platite jednim klikom. Zaboravite na gužve i vreme provedeno u traženju parkinga
                            - prepustite to nama!
                        </p>
                    </div>
                    <div className="info-box-image">
                        <img src="/assets/1.png" alt="" />
                    </div>
                </div>
                <div className='info-box'>
                    <div className='info-box-text'>
                        <h1>
                            Pametno parkiranje u svakom trenutku
                        </h1>
                        <p>
                            Vaše vreme je dragoceno - ne trošite ga na traženje parkinga! Naša aplikacija
                            vam omogućava pristup realnim informacijama o dostupnim mestima u vašoj blizini,
                            brzo plaćanje i podsećanja na istekao parking. Uživajte u slobodnom i
                            organizovanom parkiranju uz našu pomoć.
                        </p>
                    </div>
                    <div className="info-box-image">
                        <img src="/assets/2.png" alt="" />
                    </div>
                </div>
                <div className='info-box'>
                    <div className='info-box-text'>
                        <h1>
                            Pouzdan pratilac na putu do slobodnog parkinga
                        </h1>
                        <p>
                            Bilo da ste u centru grada ili u prometnim delovima, naša aplikacija je vaš saveznik
                            u potrazi za parkingom. Rezervišite mesto unapred, pratite vreme parkiranja i uvek
                            budite korak ispred drugih. Parkiranje nikad nije bilo lakše i sigurnije!
                        </p>
                    </div>
                    <div className="info-box-image">
                        <img src="/assets/3.png" alt="" />
                    </div>
                </div>
                <div className='info-box'>
                    <div className='info-box-text'>
                        <h1>
                            Brzo, sigurno i bezbrižno parkiranje
                        </h1>
                        <p>
                            Vaša sigurnost i praktičnost su naš prioritet! Pronađite slobodna parking mesta,
                            rezervišite ih i platite bez čekanja. Naša aplikacija vam omogućava da lako
                            upravljate svim aspektima parkiranja kako biste uživali u svakom trenutku svoje
                            vožnje.
                        </p>
                    </div>
                    <div className="info-box-image">
                        <img src="/assets/4.png" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}
