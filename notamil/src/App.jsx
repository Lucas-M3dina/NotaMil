import * as React from "react";
import { Link } from "react-router-dom";
import {useState, useEffect} from 'react'
import axios from 'axios';
import '@lottiefiles/lottie-player';
import './App.css';

import Logo from './assets/logo.webp';
import Alerta from './assets/alerta.webp';
import Figura1ComoFunciona from './assets/figuraComoFunciona.webp';
import Figura2ComoFunciona from './assets/figuraComoFunciona2.webp';
import Figura3ComoFunciona from './assets/figuraRobo.webp';
import Bars from './assets/bars.webp';

export default function App() {
  const [numeroPalavras, setPalavras] = useState('0');
  const [numeroCaracteres, setCaracteres] = useState('0');
  const [redacaoCorrigida, setRedacaoCorrigida] = useState({});
  const [redacao, setRedacao] = useState('');
  const [redacaoGerada, setRedacaoGerada] = useState('');
  const [tema, setTema] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('Algo deu errado');


  /* FUNÇÃO RESPONSAVEL PELA CONTAGEM DE PALAVRAS E CARACTERES INSERIDOS */
  function contagem(){
    const texto = document.getElementsByClassName("texto-corrigir")[0].value;
    var caracteres = 0 ;
    var palavras = texto.split(" ");
    var nPalavras = texto.split(" ").length;

    palavras.forEach((palavra) => {
      if (palavra === "") {
        nPalavras -= 1
      } else {
        caracteres += palavra.length;
      }
    });

    setPalavras(nPalavras);
    setCaracteres(caracteres);
  }


  /*  FUNÇÃO RESPONSAVEL POR TROCAR TAB DE CORRIGIR REDAÇÃO PARA GERAR REDAÇÃO E VICE E VERSA  */
  function trocarTab(){
    const btnTroca = document.querySelectorAll(".container-btn button");
    const vetorGerar = document.querySelectorAll(".icon-gerar path");
    const vetorAvaliar = document.querySelectorAll(".icon-corrigir path");
    const containerGerar = document.querySelector('.container-gerar');
    const containerCorrigir = document.querySelector('.container-corrigir');

    const activeTab = (index) => {
      
      btnTroca.forEach((content) => {
        content.classList.replace('btn-ativo', 'btn-desligado');
      });
      
      if (index === 0) {
        vetorGerar.forEach((content) => {
          content.style.fill = '#353535'
        });
        vetorAvaliar.forEach((content) => {
          content.style.fill = '#42A3B1'
        });
        containerGerar.style.display = 'none';
        containerCorrigir.style.display = 'flex';
      } else if (index === 1){
        vetorGerar.forEach((content) => {
          content.style.fill = '#42A3B1'
        });
        vetorAvaliar.forEach((content) => {
          content.style.fill = '#353535'
        });
        containerGerar.style.display = 'flex';
        containerCorrigir.style.display = 'none';
      }

      btnTroca[index].classList.replace('btn-desligado', 'btn-ativo');
    }

    btnTroca.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        activeTab(index);
      });
    });
  }
  
  useEffect(() => {
    trocarTab()
  }, []);

  // FUNÇÃO PARA CONSUMIR API CIRA
  async function consumirCIRA(e){
    e.preventDefault()
    
    var erro = redacao.split('%').length; 

    if (numeroPalavras >= 300 && erro === 1) {
      setLoading(true);
      await axios.get('https://notamil-api.onrender.com/cira/' + redacao)
      .then((resp) => {
        setRedacaoCorrigida(resp.data); 
        if(resp.status === 200){
          setLoading(false);
          mostrarPontuacao();
        }
      })
      .catch((erro) => {
        setMensagemErro('Esse serviço depende da disponibilidade da I.A CIRA e houve um erro na comunicação com a tecnologia')
        setLoading(false);
        mostrarErro()
      })
    } else{
      setMensagemErro('Algo deu errado! Verifique se sua redação possui ao menos 300 palavras e se ela possui simbolos não suportados ( % )')
      mostrarErro()
    }
    
    
  }

  // FUNÇÃO PARA CONSUMIR API CHATGPT
  async function consumirGPT(e){
    e.preventDefault()
    
    var erro = tema.split('%').length;

    if (tema !== "" && erro === 1) {
      setLoading(true);
      await axios.get('https://notamil-api.onrender.com/chatgpt/' + tema)
      .then((resp) => {
        if (resp.status === 200){
          setRedacaoGerada(resp.data.choices[0].text);
          setLoading(false);
        }
      })
      .catch((erro) => {
        setLoading(false);
        setMensagemErro('Esse serviço depende da disponibilidade da I.A ChatGPT e houve um erro na comunicação com a tecnologia')
        mostrarErro()
        
      })
    }  else{
      setMensagemErro('Algo deu errado! Verifique se escreveu um tema ou possui simbolos')
      mostrarErro()
    }
  }

  //FUNÇÃO RESPONSAVEL POR MUDAR A COR DA PONTUACAO TIRADA
  function alterarCorPontuacao(){
    const contorno = document.querySelector('.contorno-pontuacao')
    const valor = document.querySelector('.valor-pontuacao')
    if(redacaoCorrigida.score < 700){
      contorno.style.background = 'linear-gradient(#EC3F3F, #FFED92)';
      valor.style.color = '#EC3F3F';
    }else{
      contorno.style.background = 'linear-gradient(#95EC76, #FFED92)';
      valor.style.color = '#95EC76';
    }
  }

  useEffect(() => {
    alterarCorPontuacao();
  })

  // FUNÇÃO PARA MOSTRAR PONTUAÇÃO TIRADA NA REDAÇÃO 
  function mostrarPontuacao(){
    
    const divPontuacao = document.querySelector('.pontuacao');
    divPontuacao.classList.toggle('mostrar-pontuacao');
  }

  // Função para tela de loading
  function preparandoLoading(){
    const containerLoad = document.querySelector('.container-load');

    if(loading){
      containerLoad.style.display = 'flex';
    }else if (!loading){
      containerLoad.style.display = 'none';
    }
  }

  useEffect(() => {
    preparandoLoading()
  })

  // FUNÇÃO PARA ANIMAR AO SCROLL
  function animarScroll(){
    const sections = document.querySelectorAll('.animaScroll');

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top - (window.innerHeight * 0.6)
      if(sectionTop < 0){
        section.classList.add('scrollON')
      }else{
        section.classList.remove('scrollON')
      }
    })
  }

  useEffect(() =>{
    window.addEventListener('scroll', animarScroll);
  },[])

  // FUNÇÃO PARA MOSTRAR MENSAGEM DE ERRO
  function mostrarErro(){
    
    const divErro = document.querySelector('.erro');
    divErro.classList.toggle('mostrar-erro');
  }

  //FUNCÃO PARA ANIMAÇÃO DE SCROLL SUAVE
    
  function ScrollSuave(e){
    e.preventDefault();

    const hrefBruto = e.currentTarget.getAttribute('href');
    const href = hrefBruto.split('/')[1];

    const section = document.querySelector(href);

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  // FUNÇÃO PARA MOSTRAR MENU DE HAMBURGUER
  function mostrarMenu(){
    
    const menu = document.querySelector('.container-links-header');
    menu.classList.toggle('mostrar-erro');
  }
  
  

  
  

  return (
    <>
      <header> 
        <div className="container-header">
          <img src={Logo} alt="Logo" className="logo" />
          <nav className="container-links-header">
            <Link to='https://lucasmedina.vercel.app' target="_blank" className="link-header">Sobre mim</Link>
            <Link to='#jsComoFunciona' onClick={(e) => {ScrollSuave(e)}} className="link-header">Como funciona?</Link>
            <Link to='#jsBoxPrincipal' onClick={(e) => {ScrollSuave(e)}} className="link-header">Comece ja</Link>
          </nav>
          <img className="logo-menu" src={Bars} alt="Menu hamburguer" onClick={() => {mostrarMenu()}} />
        </div>
      </header>

      <main>
        <section className="banner-principal">
          <div className="container-banner-principal">
            <p className="texto-banner-principal">Bem-vindo ao nosso site! Estamos entusiasmados em lhe apresentar nossa ferramenta de avaliação e geração de redações.</p>
            <div className="box-principal" id="jsBoxPrincipal">
              <div className="container-btn">
                <button  className='btn-ativo'> <svg className='icon-corrigir' viewBox="0 0 35 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34.7402 49.0957C23.1983 49.0957 11.6563 49.0957 0.0957031 49.0957C0.0957031 34.7701 0.0957031 20.4446 0.140555 6.07415C2.57123 6.0293 4.95706 6.0293 7.38058 6.0293C7.38058 4.98441 7.38058 3.98826 7.38058 2.96682C7.49535 2.96682 7.57223 2.96682 7.64911 2.96682C9.40308 2.96681 11.1571 2.96271 12.911 2.97098C13.1916 2.9723 13.326 2.9162 13.4522 2.61102C13.6308 2.17885 13.9298 1.78087 14.2393 1.42159C14.8492 0.713496 15.6847 0.364681 16.5566 0.0957031C17.101 0.0957031 17.6454 0.0957031 18.2464 0.131685C19.7929 0.443985 20.8071 1.33184 21.4176 2.67815C21.5331 2.93301 21.6411 2.96819 21.8557 2.96769C22.7642 2.96557 23.6728 2.9668 24.5814 2.9668C25.5327 2.9668 26.484 2.9668 27.4724 2.9668C27.4724 4.00582 27.4724 5.00174 27.4724 6.03335C29.9083 6.03335 32.3069 6.03335 34.7402 6.03335C34.7402 20.4119 34.7402 34.7538 34.7402 49.0957ZM20.1455 11.7715C15.8938 11.7715 11.642 11.7715 7.35215 11.7715C7.35215 10.7848 7.35215 9.85218 7.35215 8.92837C5.87122 8.92837 4.42877 8.92837 2.99429 8.92837C2.99429 21.3721 2.99429 33.7879 2.99429 46.1974C12.6304 46.1974 22.2391 46.1974 31.8424 46.1974C31.8424 33.7544 31.8424 21.3386 31.8424 8.92744C30.3731 8.92744 28.9307 8.92744 27.4503 8.92744C27.4503 9.88655 27.4503 10.8192 27.4503 11.7715C25.0218 11.7715 22.6315 11.7715 20.1455 11.7715ZM16.7144 3.24414C16.3525 3.48434 16.1006 3.78509 16.0736 4.24897C16.0429 4.77544 15.98 5.30004 15.9277 5.86209C14.0312 5.86209 12.1423 5.86209 10.2714 5.86209C10.2714 6.89603 10.2714 7.89189 10.2714 8.8703C15.0618 8.8703 19.821 8.8703 24.5655 8.8703C24.5655 7.84415 24.5655 6.84834 24.5655 5.8157C22.6464 5.8157 20.7574 5.8157 18.8535 5.8157C18.8535 5.41269 18.8727 5.04611 18.8501 4.68212C18.7658 3.32468 17.8635 2.76209 16.7144 3.24414Z" fill="#42A3B1"/>
                <path d="M12.848 35.8647C13.3128 36.3225 13.7536 36.7563 14.1882 37.1841C13.5681 37.7963 12.9814 38.3756 12.3961 38.9535C13.0491 39.5857 13.6497 40.1672 14.2146 40.714C13.4215 41.5055 12.7173 42.2084 11.9839 42.9403C11.4521 42.4019 10.864 41.8067 10.2686 41.204C9.65382 41.834 9.07765 42.4243 8.53948 42.9757C7.78931 42.2255 7.08577 41.522 6.34834 40.7845C6.88456 40.2632 7.48449 39.6799 8.08023 39.1007C7.44485 38.4741 6.85763 37.895 6.31152 37.3565C7.06531 36.604 7.76928 35.9012 8.51918 35.1526C9.01928 35.6909 9.58901 36.304 10.1528 36.9108C10.8052 36.2495 11.3841 35.6627 12.1006 34.9365C12.3739 35.2781 12.599 35.5594 12.848 35.8647Z" fill="#42A3B1"/>
                <path d="M12.6089 17.2983C13.384 16.518 14.1351 15.7615 14.8556 15.0359C15.5817 15.7641 16.2841 16.4686 16.9616 17.148C14.745 19.3642 12.4836 21.6251 10.2558 23.8524C8.98876 22.5856 7.6854 21.2825 6.42334 20.0207C7.06633 19.379 7.77028 18.6766 8.51192 17.9365C9.01338 18.4689 9.58713 19.078 10.1908 19.719C11.0367 18.8722 11.8108 18.0972 12.6089 17.2983Z" fill="#42A3B1"/>
                <path d="M15.0444 23.7057C15.7346 24.3891 16.4014 25.0472 17.0418 25.6793C14.745 27.9768 12.4843 30.2382 10.2575 32.4657C8.99005 31.1986 7.68672 29.8956 6.42529 28.6346C7.06763 27.9939 7.77164 27.2917 8.50302 26.5622C9.00665 27.088 9.58544 27.6922 10.2086 28.3427C10.8762 27.6642 11.4741 27.0514 12.0777 26.4442C12.9317 25.5851 13.7871 24.7272 14.6503 23.8774C14.7458 23.7833 14.896 23.7448 15.0444 23.7057Z" fill="#42A3B1"/>
                <path d="M27.8483 17.5137C28.2448 17.5137 28.5937 17.5137 28.9702 17.5137C28.9702 18.4652 28.9702 19.3972 28.9702 20.3571C26.1 20.3571 23.2224 20.3571 20.3169 20.3571C20.3169 19.433 20.3169 18.501 20.3169 17.5137C22.8066 17.5137 25.3037 17.5137 27.8483 17.5137Z" fill="#42A3B1"/>
                <path d="M25.266 28.998C26.5237 28.998 27.7336 28.998 28.9709 28.998C28.9709 29.9503 28.9709 30.8823 28.9709 31.8419C26.0996 31.8419 23.2221 31.8419 20.3169 31.8419C20.3169 30.9169 20.3169 29.9849 20.3169 28.998C21.9461 28.998 23.5821 28.998 25.266 28.998Z" fill="#42A3B1"/>
                <path d="M28.6024 40.4824C28.8986 40.4448 29.0133 40.5105 29.0058 40.8041C28.9845 41.6321 28.9984 42.4609 28.9984 43.3214C26.109 43.3214 23.2312 43.3214 20.3213 43.3214C20.3213 42.4103 20.3213 41.478 20.3213 40.4824C23.0531 40.4824 25.8046 40.4824 28.6024 40.4824Z" fill="#42A3B1"/>
                <path d="M25.4573 23.2559C26.6512 23.2559 27.7972 23.2559 28.9707 23.2559C28.9707 24.2079 28.9707 25.1399 28.9707 26.0995C27.0569 26.0995 25.1363 26.0995 23.188 26.0995C23.188 25.1749 23.188 24.2429 23.188 23.2559C23.9233 23.2559 24.6663 23.2559 25.4573 23.2559Z" fill="#42A3B1"/>
                <path d="M27.1799 37.6113C25.8265 37.6113 24.521 37.6113 23.188 37.6113C23.188 36.6593 23.188 35.7274 23.188 34.7677C25.1017 34.7677 27.0223 34.7677 28.9707 34.7677C28.9707 35.6923 28.9707 36.6242 28.9707 37.6113C28.3947 37.6113 27.8112 37.6113 27.1799 37.6113Z" fill="#42A3B1"/>
                </svg>
                Corrigir Redação</button>
                
                <button className='btn-desligado'> <svg className='icon-gerar' viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M33.1832 41.5046C33.0096 42.2098 32.869 42.9261 32.6406 43.6131C32.5783 43.8002 32.2569 43.9085 32.0428 44.0333C31.9796 44.07 31.877 44.039 31.7924 44.039C21.5425 44.039 11.2926 44.039 1.04277 44.0389C0.293455 44.0389 0.163915 43.9105 0.164063 43.1667C0.164207 42.4394 0.165657 41.7121 0.219882 40.9377C0.772854 40.8906 1.27248 40.8905 1.77917 40.9375C1.78624 41.4508 1.78624 41.9171 1.78624 42.3914C9.84683 42.3914 17.8363 42.3914 25.8467 42.3914C25.7852 42.1112 25.7291 41.8562 25.7194 41.6013C26.3328 41.5675 26.9 41.5336 27.4744 41.5403C27.5099 41.6754 27.563 41.77 27.5622 41.8641C27.5579 42.3737 27.8498 42.4456 28.281 42.4221C28.8704 42.3899 29.4629 42.414 30.054 42.414C31.0842 42.414 31.0836 42.4139 31.3781 41.4211C31.3916 41.3754 31.4334 41.338 31.5022 41.3062C32.0893 41.3787 32.6363 41.4416 33.1832 41.5046Z" fill="#353535"/> <path d="M0.181405 4.0228C0.175655 2.94021 0.16505 1.85763 0.16667 0.775055C0.167273 0.372011 0.386306 0.164448 0.793372 0.163938C0.877977 0.163832 0.962583 0.163902 1.04719 0.163902C11.2675 0.163902 21.4878 0.163866 31.7081 0.163977C32.5085 0.163986 32.6643 0.322614 32.664 1.13654C32.6638 1.72877 32.6624 2.321 32.6081 2.96041C32.0552 3.00756 31.5556 3.00752 31.049 2.96093C31.0419 2.54845 31.0419 2.18253 31.0419 1.81945C21.2583 1.81945 11.5394 1.81945 1.77194 1.81945C1.77194 2.57398 1.77194 3.29842 1.72566 4.02293C1.18006 4.02293 0.680732 4.02286 0.181405 4.0228Z" fill="#353535"/> <path d="M33.2565 17.5955C33.5356 17.7438 33.8186 17.8852 34.0929 18.0418C34.5854 18.3228 35.0379 18.3856 35.5303 17.9883C35.9251 17.6697 36.3951 17.4449 36.829 17.174C37.2296 16.9239 37.7223 16.9589 38.0649 17.2989C39.2176 18.4427 40.3586 19.5984 41.513 20.7405C41.7846 21.0092 41.8295 21.3076 41.6835 21.629C41.5403 21.9444 41.353 22.2397 41.1352 22.5317C40.9114 22.4484 40.7376 22.3184 40.5632 22.3175C40.1365 22.3152 39.7094 22.3726 39.2867 22.3708C39.4588 22.0543 39.6266 21.7729 39.7581 21.5524C38.9161 20.7084 38.1098 19.9003 37.2764 19.0651C36.7948 19.3535 36.2638 19.6541 35.7512 19.9832C35.2508 20.3044 34.7758 20.3841 34.2146 20.0887C33.6639 19.7989 33.0788 19.5466 32.4799 19.3847C31.997 19.2542 31.8 18.9352 31.6609 18.5417C31.5583 18.2515 31.5259 17.9365 31.5088 17.6326C32.1224 17.6203 32.6895 17.6079 33.2565 17.5955Z" fill="#353535"/> <path d="M33.2155 41.4842C32.6363 41.4416 32.0894 41.3786 31.4956 41.2655C31.5169 40.9103 31.5593 40.5965 31.6595 40.3024C31.7881 39.9247 31.9595 39.6006 32.4203 39.4688C33.0362 39.2926 33.6586 39.0797 34.2144 38.7684C34.7978 38.4417 35.2636 38.5297 35.7779 38.8666C36.2864 39.1997 36.8237 39.4888 37.3183 39.7795C38.1527 38.947 38.9518 38.1496 39.7693 37.3339C39.6385 37.0794 39.4968 36.8033 39.4033 36.5265C40.1286 36.5586 40.8057 36.5916 41.4828 36.6246C41.9716 37.2397 41.9516 37.6436 41.4003 38.1958C40.3264 39.2712 39.2438 40.338 38.181 41.4242C37.8418 41.771 37.4886 41.8359 37.0802 41.611C36.5306 41.3083 35.98 41.0052 35.4491 40.6715C35.1221 40.4659 34.836 40.3413 34.4629 40.582C34.2332 40.7302 33.9523 40.8034 33.6885 40.8932C33.4092 40.9882 33.2215 41.1396 33.2155 41.4842Z" fill="#353535"/> <path d="M33.2345 17.5597C32.6893 17.6079 32.1222 17.6203 31.5005 17.5929C31.3793 17.3341 31.2657 17.1172 31.2562 16.8957C31.2375 16.4596 31.0057 16.3927 30.6353 16.4076C30.0473 16.4313 29.4575 16.4094 28.8686 16.4156C28.4836 16.4196 28.0264 16.3183 27.7375 16.4913C27.5202 16.6215 27.519 17.1125 27.4217 17.4428C27.403 17.5061 27.3844 17.5693 27.3193 17.6326C26.7057 17.6326 26.1385 17.6326 25.5645 17.5918C25.7335 16.8496 25.9053 16.1472 26.087 15.4473C26.2045 14.9948 26.4498 14.7361 26.9756 14.7794C27.4957 14.8223 28.022 14.7888 28.5456 14.7888C29.3667 14.7888 30.1879 14.7888 31.056 14.7888C31.056 14.2728 31.056 13.8197 31.1023 13.3666C31.648 13.3667 32.1474 13.3666 32.6468 13.3665C32.5556 14.7904 32.8164 16.1663 33.2345 17.5597Z" fill="#353535"/> <path d="M39.2823 22.406C39.7092 22.3726 40.1363 22.3152 40.563 22.3175C40.7375 22.3184 40.9112 22.4484 41.108 22.5588C40.9483 22.9119 40.772 23.2296 40.5816 23.5387C40.424 23.7946 40.4781 24.0089 40.5501 24.3024C40.7852 25.2609 41.3399 25.7398 42.3116 25.8153C42.6346 25.8404 42.9472 25.9851 43.2676 26.0624C43.9258 26.2212 44.1396 26.4918 44.1402 27.1892C44.1404 27.3584 44.1385 27.5277 44.0842 27.7429C43.4976 27.7888 42.9642 27.7888 42.4109 27.7551C41.7267 27.541 41.0631 27.3582 40.3981 27.1806C39.9103 27.0504 39.5661 26.8487 39.4387 26.2658C39.3038 25.6491 39.0346 25.0429 38.721 24.4907C38.5009 24.1032 38.4975 23.7668 38.6654 23.4176C38.8357 23.0634 39.0739 22.7418 39.2823 22.406Z" fill="#353535"/> <path d="M41.4786 36.5896C40.806 36.5916 40.1289 36.5586 39.3729 36.5093C39.1411 36.2402 38.9951 35.983 38.8339 35.7357C38.5106 35.2396 38.4517 34.7564 38.741 34.2012C39.0274 33.6514 39.2394 33.0607 39.4564 32.4776C39.6902 31.8495 39.8806 31.6912 40.5941 31.6333C40.6405 31.6055 40.6644 31.5863 40.7233 31.5568C40.8365 31.5448 40.9124 31.5401 41.0167 31.563C41.2851 31.6436 41.5231 31.7287 41.7655 31.7439C42.5507 31.7934 43.3375 31.8173 44.1236 31.8511C44.1477 32.3541 43.7848 32.5346 43.4044 32.6549C42.7928 32.8482 42.1753 33.0381 41.5465 33.1557C41.1729 33.2256 41.0698 33.4572 40.8942 33.7294C40.2763 34.6872 40.7108 35.4569 41.2554 36.2271C41.3312 36.3342 41.4014 36.4453 41.4786 36.5896Z" fill="#353535"/> <path d="M1.78599 41.7017C1.27933 41.7026 0.77267 41.7034 0.219075 41.703C0.167089 29.1484 0.162038 16.5951 0.164584 3.74079C0.6788 3.44023 1.18542 3.44065 1.74659 3.74159C1.79609 16.5953 1.79104 29.1485 1.78599 41.7017Z" fill="#353535"/>
                <path d="M32.6634 13.5996C32.1469 13.6959 31.6375 13.696 31.0738 13.5998C31.0242 9.83558 31.0288 6.16778 31.0807 2.50016C31.6375 2.50024 32.1469 2.50012 32.6564 2.5C32.6611 6.1678 32.6658 9.83561 32.6634 13.5996Z" fill="#353535"/> <path d="M44.1305 31.804C43.3374 31.8173 42.5506 31.7934 41.7654 31.7439C41.5231 31.7287 41.2851 31.6436 41.0381 31.5297C41.3684 31.3932 41.7038 31.3073 42.0436 31.2449C42.3175 31.1945 42.4242 31.0644 42.4209 30.7737C42.4096 29.7789 42.4255 28.7837 42.4311 27.7887C42.9644 27.7888 43.4978 27.7888 44.0775 27.7888C44.1284 29.1114 44.1328 30.4341 44.1305 31.804Z" fill="#353535"/>
                <path d="M19.6748 38.042C20.2326 38.6529 20.7904 39.2639 21.3496 39.8763C22.0078 39.4877 22.5474 39.1982 23.0555 38.8611C23.5751 38.5163 24.0676 38.4479 24.6425 38.7445C25.1839 39.0237 25.7504 39.2819 26.3354 39.4405C26.8606 39.583 27.0534 39.9252 27.1782 40.3738C27.2752 40.722 27.3616 41.0732 27.4601 41.4613C26.9003 41.5336 26.3331 41.5675 25.7196 41.6013C25.6441 41.2057 25.4209 41.0364 25.0741 40.8191C24.2053 40.2746 23.5136 40.5111 22.7976 41.0523C22.5348 41.2509 22.2463 41.4208 21.9539 41.5738C21.452 41.8363 20.9849 41.7592 20.582 41.3589C19.6708 40.4535 18.7651 39.5425 17.8501 38.5629C18.0367 38.4112 18.2237 38.3003 18.4253 38.2561C18.8376 38.1658 19.2579 38.1113 19.6748 38.042Z" fill="#353535"/> <path d="M27.3193 17.6325C27.2519 18.0406 27.1878 18.4729 27.0053 18.8475C26.8989 19.0657 26.6252 19.24 26.3878 19.3495C25.7195 19.658 25.0462 19.9747 24.3436 20.1816C24.0216 20.2764 23.5863 20.2072 23.2722 20.0617C22.6494 19.7733 22.0751 19.3802 21.4535 19.0143C20.6978 19.7795 19.9636 20.5228 19.1505 21.2789C18.4282 21.2908 17.7849 21.2898 17.1416 21.2889C17.2363 21.0702 17.2788 20.801 17.434 20.6411C18.4925 19.5507 19.5713 18.4799 20.651 17.4102C21.0441 17.0208 21.5227 16.9765 21.9822 17.2664C22.4703 17.5744 22.9524 17.8919 23.4395 18.2016C23.7271 18.3846 23.9972 18.463 24.3385 18.2536C24.7114 18.0249 25.1359 17.8803 25.5546 17.6658C26.1385 17.6326 26.7056 17.6326 27.3193 17.6325Z" fill="#353535"/> <path d="M40.5938 31.6333C40.5934 31.6166 40.6131 31.5883 40.6592 31.5621C40.664 31.5863 40.6401 31.6055 40.5938 31.6333Z" fill="#353535"/> <path d="M10.5235 5.85135C8.3744 5.85135 6.2761 5.85199 4.1778 5.85097C3.56213 5.85066 3.4132 5.68612 3.41407 5.01872C3.41487 4.39948 3.57623 4.22689 4.16729 4.22684C12.2897 4.2262 20.4122 4.22621 28.5347 4.22672C29.2676 4.22677 29.6747 4.80234 29.3916 5.47461C29.2633 5.77921 28.9901 5.86072 28.6467 5.85942C25.1609 5.84621 21.675 5.85135 18.1891 5.85135C15.6508 5.85135 13.1125 5.85135 10.5235 5.85135Z" fill="#353535"/> <path d="M9.1016 9.10143C12.0791 9.10143 15.0058 9.10118 17.9326 9.1016C18.6971 9.10171 19.0771 9.59058 18.8386 10.3119C18.7444 10.5966 18.5146 10.7375 18.1742 10.7334C16.7703 10.7165 15.366 10.7263 13.9618 10.7263C10.7137 10.7263 7.4655 10.7266 4.21734 10.7261C3.5481 10.726 3.41251 10.5824 3.41408 9.8825C3.41548 9.25472 3.57431 9.10177 4.22933 9.10157C5.83649 9.1011 7.44366 9.10143 9.1016 9.10143Z" fill="#353535"/> <path d="M17.6243 14.789C13.1085 14.789 8.64222 14.7942 4.17604 14.7748C3.93122 14.7738 3.53279 14.6182 3.47696 14.4465C3.3782 14.1426 3.43795 13.7558 3.53492 13.435C3.57484 13.3029 3.88254 13.1757 4.06882 13.1751C8.73806 13.1609 13.4073 13.1627 18.0766 13.1655C18.6756 13.1659 18.8566 13.3861 18.8517 14.0653C18.8476 14.6197 18.6698 14.7865 18.0799 14.7889C17.9446 14.7894 17.8092 14.789 17.6243 14.789Z" fill="#353535"/> <path d="M9.00007 17.2264C11.7591 17.2264 14.4674 17.2258 17.1757 17.2269C17.8353 17.2271 18.0397 17.4225 18.0392 18.0405C18.0386 18.6564 17.8335 18.8508 17.1721 18.8509C12.8388 18.8517 8.50559 18.8517 4.17234 18.8509C3.55923 18.8508 3.41279 18.6858 3.41407 18.0116C3.41524 17.3972 3.57798 17.2273 4.17595 17.2268C5.76706 17.2256 7.35817 17.2264 9.00007 17.2264Z" fill="#353535"/> <path d="M5.44561 22.914C4.93791 22.9139 4.48074 22.9219 4.02397 22.9116C3.58863 22.9017 3.41537 22.6701 3.41407 22.1287C3.41265 21.5345 3.57399 21.2926 4.02012 21.2919C7.64221 21.2868 11.2643 21.2863 14.8864 21.292C15.4188 21.2929 15.6124 21.5447 15.6015 22.1503C15.5918 22.6936 15.3849 22.9115 14.8393 22.9121C11.725 22.9158 8.61065 22.9139 5.44561 22.914Z" fill="#353535"/> <path d="M7.17163 39.1642C6.1235 39.1642 5.12615 39.1664 4.12881 39.1633C3.58361 39.1616 3.41528 38.9736 3.41359 38.3828C3.41172 37.7277 3.56247 37.5403 4.11689 37.5399C6.87227 37.5375 9.62766 37.5368 12.383 37.5404C12.9854 37.5411 13.1688 37.761 13.164 38.4364C13.1601 38.9933 12.9828 39.1633 12.3951 39.1637C10.6709 39.1649 8.94664 39.1642 7.17163 39.1642Z" fill="#353535"/>
                <path d="M12.6919 35.9116C9.83917 35.9135 7.03163 35.9141 4.22408 35.9137C3.55352 35.9137 3.41251 35.7663 3.41408 35.0749C3.4155 34.4429 3.57302 34.2893 4.22655 34.2892C6.89879 34.2887 9.57104 34.2923 12.2433 34.2853C12.6341 34.2843 13.0344 34.3043 13.1272 34.7483C13.2168 35.1771 13.3084 35.6733 12.6919 35.9116Z" fill="#353535"/> <path d="M7.78125 25.3514C9.32135 25.3514 10.8107 25.3504 12.3 25.3518C12.9601 25.3525 13.1647 25.5476 13.164 26.1656C13.1633 26.7814 12.9581 26.9757 12.2962 26.9759C9.58832 26.977 6.88047 26.977 4.17262 26.9759C3.55913 26.9756 3.41288 26.8109 3.41407 26.1365C3.41515 25.5221 3.57786 25.3525 4.17641 25.3518C5.36109 25.3503 6.54578 25.3514 7.78125 25.3514Z" fill="#353535"/> <path d="M23.0562 12.1404C22.5499 11.6376 22.0984 11.1302 21.5886 10.6904C21.1998 10.3549 21.2304 9.55742 21.4424 9.30867C21.6843 9.02486 22.3213 9.00321 22.7212 9.31216C23.0655 9.5782 23.3647 9.90257 23.8639 10.387C23.9813 10.1834 24.064 9.94654 24.222 9.78197C24.8767 9.1001 25.5504 8.43626 26.2247 7.77353C26.598 7.40667 27.1686 7.34905 27.4862 7.62751C27.8759 7.96914 27.9392 8.57965 27.5695 8.95842C26.5202 10.0335 25.4653 11.1044 24.3771 12.1397C24.0042 12.4945 23.5229 12.4482 23.0562 12.1404Z" fill="#353535"/> <path d="M16.3971 29.7183C16.4029 30.0728 16.4291 30.4284 16.4085 30.7813C16.391 31.081 16.5301 31.1872 16.795 31.245C17.3588 31.368 17.9219 31.4984 18.4775 31.6538C18.9411 31.7834 19.2738 31.9996 19.3911 32.566C19.5159 33.1691 19.8356 33.7317 20.0282 34.3502C19.6661 34.3892 19.3393 34.3504 19.0282 34.4037C18.7882 34.4447 18.568 34.6012 18.339 34.7064C18.2348 34.453 18.0986 34.2076 18.0338 33.9445C17.9319 33.5311 17.6649 33.3609 17.2776 33.2707C16.6226 33.1181 15.975 32.934 15.3243 32.7631C14.9492 32.6646 14.7825 32.4203 14.7867 32.0342C14.7947 31.2937 14.7904 30.5531 14.8448 29.7656C15.398 29.7185 15.8975 29.7184 16.3971 29.7183Z" fill="#353535"/> <path d="M16.4037 29.6712C15.8974 29.7184 15.3979 29.7185 14.8521 29.7184C14.8002 28.8114 14.7937 27.9045 14.7896 26.9976C14.7874 26.5311 15.0297 26.2692 15.4758 26.1625C16.1604 25.9988 16.8458 25.8357 17.5221 25.6418C17.6735 25.5984 17.7888 25.429 17.9837 25.2838C18.5898 25.2852 19.1329 25.3204 19.6759 25.3556C19.551 25.7636 19.485 26.2047 19.2812 26.5684C19.1377 26.8244 18.8354 27.0586 18.5534 27.1554C17.9809 27.352 17.3761 27.4585 16.7805 27.5826C16.5045 27.6402 16.3965 27.7687 16.4076 28.0573C16.4276 28.5788 16.4115 29.1017 16.4037 29.6712Z" fill="#353535"/> <path d="M19.7077 25.3382C19.1333 25.3204 18.5902 25.2852 18.0009 25.2499C17.982 25.1414 17.9788 25.0096 18.0413 24.9281C18.6854 24.0876 18.1609 23.4398 17.7331 22.7421C17.4742 22.32 17.3256 21.8303 17.1348 21.3299C17.7854 21.2898 18.4286 21.2908 19.1203 21.2926C19.1771 21.4551 19.1365 21.6416 19.2033 21.7737C19.403 22.1688 19.6047 22.5747 19.8788 22.9179C20.4149 23.5893 20.3671 24.2411 19.9389 24.9249C19.8608 25.0497 19.8051 25.1884 19.7077 25.3382Z" fill="#353535"/> <path d="M18.3422 34.7428C18.5683 34.6012 18.7885 34.4447 19.0285 34.4037C19.3396 34.3504 19.6664 34.3892 20.0344 34.3876C20.449 34.7315 20.3194 35.1263 20.1335 35.4731C19.7996 36.0958 19.4137 36.6907 18.9582 37.4493C19.1733 37.6152 19.4096 37.7975 19.6605 38.0109C19.258 38.1113 18.8378 38.1658 18.4254 38.2562C18.2238 38.3003 18.0368 38.4112 17.8363 38.5325C17.7061 38.461 17.5766 38.3551 17.4607 38.2359C16.9561 37.7168 16.9341 37.3796 17.345 36.7596C17.6717 36.2665 18.0048 35.7765 18.3043 35.267C18.3789 35.1403 18.3347 34.9437 18.3422 34.7428Z" fill="#353535"/> <path d="M35.6253 31.4498C35.2595 32.1305 34.9606 32.8592 34.5142 33.4822C33.5298 34.8559 32.1236 35.6454 30.4755 35.8701C28.617 36.1234 26.8702 35.7761 25.3477 34.5537C24.2433 33.667 23.5227 32.5575 23.167 31.1891C23.7688 31.2396 24.3298 31.399 24.8805 31.0465C25.2958 32.1901 26.0776 32.9852 27.056 33.599C28.3578 34.4157 30.5015 34.3981 31.8077 33.5801C32.7081 33.0162 33.3444 32.2351 33.914 31.344C34.5133 31.382 35.0693 31.4159 35.6253 31.4498Z" fill="#353535"/> <path d="M23.5112 26.6682C23.964 25.4221 24.8459 24.5153 25.9363 23.8454C27.6918 22.7669 29.6051 22.5969 31.5509 23.2251C33.3312 23.7998 34.5794 25.0192 35.3387 26.7378C34.7229 26.845 34.1486 26.9168 33.543 26.9715C33.2052 26.5824 32.9261 26.1827 32.5873 25.8428C31.1634 24.4143 28.5356 24.208 26.9791 25.3168C26.3916 25.7353 25.899 26.2868 25.3233 26.7614C24.6927 26.7195 24.102 26.6939 23.5112 26.6682Z" fill="#353535"/> <path d="M33.5742 26.9885C34.1485 26.9168 34.7228 26.845 35.3432 26.7732C35.5641 27.4207 35.856 28.0629 35.8856 28.717C35.9259 29.6087 35.7664 30.5094 35.6589 31.4281C35.0694 31.4159 34.5133 31.382 33.9194 31.3037C34.3679 29.7933 34.3452 28.364 33.5742 26.9885Z" fill="#353535"/> <path d="M23.4793 26.6861C24.1019 26.6938 24.6926 26.7195 25.3182 26.7983C24.8795 27.6053 24.5853 28.4163 24.6472 29.3172C24.6865 29.8893 24.7793 30.4577 24.8482 31.0277C24.3299 31.399 23.7689 31.2396 23.1741 31.1497C23.0619 30.9249 22.9326 30.7111 22.9272 30.4941C22.8953 29.2047 22.8024 27.902 23.4793 26.6861Z" fill="#353535"/> </svg>
                Gerar Redação</button>
              </div>

              <div className="container-gerar">
                <form onSubmit={(e) => { consumirGPT(e) }} className="form-gerar">
                  <input type="text" placeholder="Insira o tema da redação que deseja" className="input-gerar" onChange={(e) => {
                    setTema(e.target.value)
                  }} value={tema} />
                  <button type='submit' className='btn-gerar'>GERAR</button>

                </form>

                <textarea className='texto-gerar' value={redacaoGerada} disabled></textarea>
              </div>
              

              <div className="container-corrigir">
                <form className='form-corrigir' onSubmit={(e) => {consumirCIRA(e)}}>
                  <textarea id='redacaoCorrigir' className='texto-corrigir' onChange={(e) => {
                    contagem()
                    setRedacao(e.target.value)
                    }} value={redacao} placeholder='Insira ou cole aqui a redação a ser avaliada'></textarea>
                  <span className="contagem-corrigir">Palavras: {numeroPalavras}     |     Caracteres: {numeroCaracteres}</span>
                  <button type='submit' id='btn-corrigir' className='btn-corrigir'>CORRIGIR</button>
                </form>
                <div className="pontuacao">
                  <div className="container-pontuacao">
                    <p className="texto-pontuacao">Sua redação foi avaliada em:</p>
                    <div className="contorno-pontuacao">
                      <div className="contorno-pontuacao2">
                        <span className='valor-pontuacao'>{redacaoCorrigida.score}</span>
                      </div>
                    </div>
                    <button className='btn-pontuacao' onClick={() => { mostrarPontuacao() }} type='button'>FECHAR</button>
                  </div>
                </div>

                
              </div>
              <div className="container-load">
                  {loading && <lottie-player
                  src="https://assets7.lottiefiles.com/packages/lf20_dkz94xcg.json"
                  autoplay
                  loop
                  id='load'
                  />}
                </div>

                <div className="erro">
                    <div className="container-erro">
                      <img src={Alerta} className='alerta' alt="Imagem de erro" />
                      <span className='texto-erro'>{mensagemErro}</span>
                      <button className='btn-pontuacao' onClick={() => { mostrarErro() }} type='button'>FECHAR</button>
                    </div>
                </div>
            </div>
          </div>
        </section>

        

        <section  className="section-como-funciona">
          <div className="container-como-funciona animaScroll" id="jsComoFunciona">
            <img className='figura1' src={Figura1ComoFunciona} alt="Figura lendo livro"/>
            <div className="textos-como-funciona">
              <h1 className="titulo-como-funciona">COMO FUNCIONA?</h1>
              <p className="texto-como-funciona full-size">A plataforma de avaliação de redações usa a tecnologia da CIRA para fornecer análises precisas e eficientes de seus textos. Com apenas alguns cliques, você pode enviar sua redação e receber uma avaliação de 0 a 1000 em questão de segundos.</p>
            </div>
          </div>

          <div className="container-como-funciona animaScroll">
            <p className="texto-como-funciona">A inteligência artificial avalia sua redação em vários aspectos, incluindo clareza, concisão, coesão, coerencia e uso correto da gramática e vocabulário.</p>
            <img className='figura1' src={Figura2ComoFunciona} alt="Figura abrindo um livro"  />
          </div>

          <div className="container-como-funciona animaScroll">
            <img className='figura1' src={Figura3ComoFunciona} alt="Figura com robo"  />
            <p className="texto-como-funciona">A plataforma usa a inteligência artificial ChatGPT para gerar redações em questão de minutos. Basta fornecer o tema e a tecnologia fará o resto. Você pode ter certeza de que a I.A fará o máximo sua redação será efetiva e impactante</p>
          </div>
        </section>
      </main>
      <footer>
        <span className="texto-footer">Todos os direitos reservados</span>
      </footer>
    </>
  );
}


