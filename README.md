# Sito personale di Enrico Rubolino

Il sito è pubblicato automaticamente da GitHub Pages all'indirizzo **https://enricorubolino.github.io**.

## Come modificare i contenuti

1. Apri la cartella **data** nel repository.
2. Apri il file **content.js**.
3. Clicca sull'icona della matita (**Edit this file**).
4. Modifica esclusivamente il testo racchiuso tra virgolette, facendo attenzione a non cancellare virgole, parentesi o virgolette.
5. Premi **Commit changes...**, inserisci una breve descrizione e conferma su **Commit changes**.
6. Attendi circa uno o due minuti e aggiorna il sito.

## Modificare un paper

Ogni paper contiene: `title` (titolo), `byline` (autori), `status` (journal o working-paper series), `description`, `paper` (link al PDF), `image` (figura principale) e `links` (replication files, premi o altri materiali).

Il pulsante **BibTeX** viene generato automaticamente usando `title`, `byline`, `status` e `paper`. Non occorre creare o aggiornare manualmente file `.bib`. Se vuoi indicare esplicitamente l'anno per un working paper, aggiungi il campo `"year": "2026"` nel relativo blocco.

Per aggiungere un paper, copia un intero blocco esistente nella sezione `workingPapers` o `publishedPapers`, incollalo nella posizione desiderata e modifica i valori tra virgolette.

## Lavori in corso

Modifica `researchInProgress`. Inserisci i coautori nel campo `coauthors`, ad esempio: `"with Jane Doe and John Smith"`.

## File tecnici

Il layout è in `styles.css` e la generazione della pagina in `app.js`. Per le normali modifiche al sito non è necessario intervenire su questi file.
