app.get('/musicas', autenticarJWT, (req, res) => {
 res.json([
 { id: 1, titulo: 'Música A', artista: 'DJ A' },
 { id: 2, titulo: 'Música B', artista: 'DJ B' },
 ]);
 });