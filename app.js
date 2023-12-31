/* global require, process */
// Imports 
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 

const app = express()

const PORT = process.env.PORT || 3000;

//Configurar JSON response
app.use(express.json()) 

// Models
const User = require('./models/User')

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({mensagem: "Bem vindo a nossa API!"})
})

// Rota privada - Private Route
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id 

    // check se o usuário já existe
    const user = await User.findById(id, '-senha')

    if(!user){
        return res.status(404).json({mensagem: 'Usuário não encontrado'})
    }

    res.status(200).json({ user })

})


//Requisição: Header Authentication com valor "Bearer {token}"
function checkToken(req, res, next ) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({ mensagem: 'Acesso negado!' })
    }

    try{

        const secret = process.env.SECRET 
        // este secret ajuda a validar o token

         // Adicionando a verificação do token com expiração
         const tokenDecodificado = jwt.verify(token, secret);

         // Verificar se o token está expirado
         if (new Date() > tokenDecodificado.exp * 1000) {
             return res.status(401).json({ mensagem: 'Sessão inválida (token expirado)' });
         }
 

        next();
        } catch (error) {
            // Capturar exceção de token expirado
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ mensagem: 'Sessão inválida (token expirado)' });
            } else{
                res.status(400).json({ mensagem:'Token inválido' })
            }
        }    
}


//Register User 

app.post( '/auth/register', async(req, res) => {

    const { name, email, senha, confirmasenha, telefone } = req.body

    //validations
    if(!name) {
        return res.status(422).json({mensagem: 'O nome é obrigatório!'})
    }

    if(!email) {
        return res.status(422).json({mensagem: 'O email é obrigatório!'})
    }

    if(!senha) {
        return res.status(422).json({mensagem: 'A senha é obrigatória!'})
    }

    if(senha !== confirmasenha) {
        return res.status(422).json({mensagem: 'As senhas não conferem!'})
    }

    if (!telefone || telefone.length === 0) {
        return res.status(422).json({ mensagem: 'Pelo menos um telefone é obrigatório!' });
    }
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso!'});


    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email: email})

    if(userExists) {
        return res.status(422).json({mensagem: '"E-mail já existente!'})
    }

    //Criar a senha
    const salt = await bcrypt.genSalt(12)
    const senhaHash = await bcrypt.hash(senha, salt)

    //criar usuário
    const user = new User({
        name,
        email,
        senha: senhaHash,
        telefone,
    })

    try {
        
        await user.save()

        user.ultimo_login = new Date(); // Atualizar o último login antes de criar o token
        await user.save(); 

        //criar um token após o usuário ser criado coom sucesso
        const secret = process.env.SECRET
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30m' });

        res.status(201).json({mensagem:'Usuário criado com sucesso!', 
        user: {
            id: user._id,
                data_criacao: user.createdAt,
                data_atualizacao: user.updatedAt,
                ultimo_login: user.ultimo_login,
                token: token
        }
        });

    } catch(error) {
        console.log('Erro ao criar usuário', error.message);
        res.status(500).json({
            mensagem:'Aconteceu um erro no servidor, tente novamente mais tarde!', 
            })
    }

});

app.get('/auth/register', (req, res) => {
    const { name, email, senha, confirmasenha, telefone } = req.query;
    const errors = [];

    // validations
    if (!name) {
        errors.push({ name: 'O nome é obrigatório!' });
    }

    if (!email) {
        errors.push({ email: 'O email é obrigatório!' });
    }

    if (!senha) {
        errors.push({ senha: 'A senha é obrigatória!' });
    }

    if (!confirmasenha) {
        errors.push({ confirmasenha: 'As senhas não conferem!' });
    }

    if (!telefone) {
        errors.push({ telefone: 'Pelo menos um telefone é obrigatório!' });
    }

    if (errors.length > 0) {
        return res.status(422).json({ mensagem: 'Erros de validação, digite os itens para acessar.', errors });
    }

    res.status(200).json({ mensagem: 'Página de registro', dadosRecebidos: { name, email, senha, confirmasenha, telefone } });
});

// Rota de Login
app.post('/auth/login', async (req, res) => {
    const { email, senha } = req.body

    //validações
    if(!email) {
        return res.status(422).json({mensagem: 'O email é obrigatório!'})
    }

    if(!senha) {
        return res.status(422).json({mensagem: 'A senha é obrigatória!'})
    }
    
    // Check se o usuário existe
    const user = await User.findOne({ email: email})

    if(!user) {
        return res.status(404).json({mensagem: 'Usuário e/ou senha inválido'})
    }

    // Check(VERIFICAR) se senha é igual a senha criada
    const checkSenha = await bcrypt.compare(senha, user.senha)

    if(!checkSenha){
        return res.status(401).json({mensagem: 'Usuário e/ou senha inválido!'})
    }

    //
    try{

         user.ultimo_login = new Date(); // Atualizar o último login antes de criar o token
         await user.save();

        const secret = process.env.SECRET
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30m' });

        res.status(200).json({mensagem: 'Autenticação relizada com sucesso!',  
            user: {
            id: user._id,
            data_criacao: user.createdAt,
            data_atualizacao: user.updatedAt,
            ultimo_login: user.ultimo_login,
            token: token 
        } 
    });

        } catch(error) {
        console.log(error);
        console.error('Não autorizado', error.message);

        res.status(500).json({mensagem:'Aconteceu um erro no servidor, tente novamente mais tarde!', 
        })
        }  
})

app.get('/auth/login', (req, res) => {
    const { email, senha } = req.query;
    const errors = [];

    // validations
    if (!email) {
        errors.push({ email: 'O email é obrigatório' });
    }

    if (!senha) {
        errors.push({ senha: 'A senha é obrigatória' });
    }

    if (errors.length > 0) {
        return res.status(422).json({ mensagem: 'Erros de validação', errors });
    }

    res.status(200).json({ mensagem: 'Página de Login' });
}); 

app.get('/exemplo', (req, res) => {
    const { name, email, senha, confirmasenha, telefone } = req.query;
    const errors = [];

    // Validations
    if (!name) {
        errors.push({ name: 'O nome é obrigatório!' });
    }

    if (!email) {
        errors.push({ email: 'O email é obrigatório!' });
    }

    if (!senha) {
        errors.push({ senha: 'A senha é obrigatória!' });
    }

    if (!confirmasenha) {
        errors.push({ confirmasenha: 'A confirmação de senha é obrigatória!' });
    }

    if (!telefone) {
        errors.push({ telefone: 'O telefone é obrigatório!' });
    }

    if (errors.length > 0) {
        return res.status(422).json({ name: 'Jonatas',
        email: 'jonatas@teste.com',
        senha: '123456',
        confirmasenha: '123456',
        telefone: '12345678911',
        mensagem: 'Autenticação realizada com sucesso!',
        user: {
        id: '656c805cb287714bb0c76ee5',
        data_criacao: '2023-12-03T13:19:24.392+00:00',
        data_atualizacao: '2023-12-04T15:02:38.032+00:00',
        ultimo_login: '2023-12-04T15:02:38.027+00:00',
        token: 'token' }
     });
    }

    // Se não houver erros, vamos supor que você tenha um token disponível
    const token = 'seu_token_aqui'; // Substitua 'seu_token_aqui' pelo valor real do seu token

    // Se não houver erros, vai retornar a resposta padrão com o token
    res.status(200).json({
        name: 'Jonatas',
        email: 'jonatas@teste.com',
        senha: '123456',
        confirmasenha: '123456',
        telefone: '12345678911',
        mensagem: 'Autenticação realizada com sucesso!',
        user: {
        id: '656c805cb287714bb0c76ee5',
        data_criacao: '2023-12-03T13:19:24.392+00:00',
        data_atualizacao: '2023-12-04T15:02:38.032+00:00',
        ultimo_login: '2023-12-04T15:02:38.027+00:00',
        token: token 
        }
    });
});


// Credenciais

mongoose.connect('mongodb+srv://jhondamataoliveira:5Jhs56TfcdvYUI@cluster0.ck2kxrh.mongodb.net/?retryWrites=true&w=majority')


.then(() => {
    app.listen(PORT, () => {
        console.log('Servidor iniciado em http://localhost:' + PORT);
        console.log('Conectou ao banco!');
    });
})
.catch((err) => console.log(err)); 