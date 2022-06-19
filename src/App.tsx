import * as C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';
import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { items } from './data/items';
import { useEffect, useState } from 'react';
import { GridItemType } from './types/GridItemType';
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () =>{
  const fase = [
    {fase:1, qtde: 4},
    {fase:2, qtde: 6}
  ];
  const [nivelAtual, setNivelAtual] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [initialCkick, setInitialClick] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => {
    resetAndCreateGrid();
  }, []);

  useEffect( () =>{
    const timer = setInterval(()=>{
      if(playing){
      setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);    
    return () => clearInterval(timer);
  },[initialCkick, timeElapsed]);

//verifica quais estao abertos
  useEffect(()=>{
    if(shownCount === 2){

      //monta um array apenas com os que estao abertos
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2){
        //verifica se os dois sao iguais
        if(opened[0].item === opened[1].item){
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid){
            if(tmpGrid[i].shown){
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);
        }else{
         setTimeout(()=>{
           //se nao forem iguais
           let tmpGrid = [...gridItems];
           for(let i in tmpGrid){
             tmpGrid[i].shown = false;
           }
           setGridItems(tmpGrid);
           setShownCount(0);
         }, 1000)
        }


        setMoveCount(moveCount => moveCount +1);
      }
    }
  }, [shownCount, gridItems]);

  //verifica se todos estao abertos e certos | (every) - verifica se todos os permanent estao verdadeiros 
  useEffect(()=> {
      if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){
        setPlaying(false);
        setInitialClick(false);
        setTimeElapsed(0);
        initialPlaying();
      }
  },[moveCount, gridItems]);
  const initialPlaying = () =>{
    if(gridItems.every(item => item.permanentShown === true)){
    if(nivelAtual < 2){
      setNivelAtual(nivelAtual + 1);
    }else{
      setNivelAtual(0);
    }

   

  }
    setTimeout(()=>{
      resetAndCreateGrid();
    }, 2000);
    

  }
  const resetAndCreateGrid = () => {
    //passo 1 resetar o jpgo
    setMoveCount(0);
    setShownCount(0);
    setTimeElapsed(0);
    //passo 2 criar o grid e comecar o jogo
    //passo 2.1 criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i = 0 ; i < (fase[nivelAtual].qtde * 2); i++) tmpGrid.push({
    item: null,shown: false,permanentShown: false
    });
    //2.2 preencher o grid
    for(let w = 0; w < 2; w++){
      for(let i = 0; i < fase[nivelAtual].qtde; i++){
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null){
         pos = Math.floor(Math.random() * (fase[nivelAtual].qtde * 2));
        }
        tmpGrid[pos].item = i;
      }
    }

    //2.3 jogar no state
    setGridItems(tmpGrid);

    //passo 3 começar o jogo
    setPlaying(true);
  }

  const handleItemClick = (index:number) =>{
    setInitialClick(true);
    if(playing && index !== null && shownCount < 2){
      let tmpGrid = [...gridItems];
      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false){
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }
      setGridItems(tmpGrid);
    }
  }
  return(

    <C.Container>
      <C.Info>
        <C.LogoLink>
          <h2>Play Memória</h2>
        </C.LogoLink>

        <C.InfoArea>
        <InfoItem  label="Tempo" value={formatTimeElapsed(timeElapsed)} />
        <InfoItem  label="Movimentos" value={moveCount.toString()} />
          
        </C.InfoArea>

        <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid}/>
      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index)=>(
            <GridItem
            key={index}
            item={item}
            onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>

  );
}

export default App;