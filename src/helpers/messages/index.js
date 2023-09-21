const welcomeMessage = () => {
  return (
    'Ola, eu posso te ajudar a ter uma organização dos seus gastos mensais. Se você é novo(a) aqui, veja o manual:' +
    '\n\nVocê pode se comunicar comigo com os seguintes comandos:\n\n' +
    '/status - Verificar status do Bot\n' +
    '/singup - Começar a me cadastrar\n' +
    '/add - Adicionar uma despesa\n' +
    '/export - Exportar dados para Excel\n'
  );
};

const withOutLoginMessage = () => {
  return (
    'Parece que você ainda não está logado, para poder usar essa função se cadastre primeiro.\n' +
    'Para se cadastrar use o seguinte comando:\n\n' +
    '/singup - Começar a me cadastrar'
  );
};

module.exports = {
  welcomeMessage,
  withOutLoginMessage,
};
