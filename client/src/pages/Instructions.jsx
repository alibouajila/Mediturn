    import React from 'react';
    import './instructions.css';
    function Instructions() {
    return (
        <div className="instructions-page">
    <div className="instructions-container">
    <h1>Instructions de Rendez-vous</h1>

    <div className="instruction-step">
        <div className="instruction-icon">📞</div>
        <p className="instruction-text">
        Après votre inscription, <strong>un assistant médical</strong> vous appellera pour confirmer le médecin désiré.
        </p>
    </div>

    <div className="instruction-step">
        <div className="instruction-icon">🕒</div>
        <p className="instruction-text">
        Vous recevrez un <strong>numéro de passage</strong> et une estimation du temps d’attente.
        </p>
    </div>

    <div className="instruction-step">
        <div className="instruction-icon">⚠️</div>
        <p className="instruction-text">
        <span className="warning">Attention :</span> tout retard entraînera la perte de votre tour.
        </p>
    </div>

    <div className="instructions-footer">
        Merci pour votre confiance.
        </div>
        </div>
        </div>

    );
    }

    export default Instructions;
