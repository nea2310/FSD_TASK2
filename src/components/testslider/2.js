else {//вертикальный режим
	if (!this.changeMode) { //Если это не переключение режима
		//режим Double
		if (!this.rightControl.classList.contains('hidden')) {
			this.selectedWidth = Math.abs(parseFloat(this.secondControl.style.top) - this.newPos) + "px";
			if (!this.currentControlFlag) { //перемещатся левый ползунок
				this.selectedPos = this.newPos + this.shift * 2 + "px";
			} else {//перемещатся правый ползунок
				this.selectedPos = this.secondControlPos - this.parentPos + "px";
			}
			//Режим Single
		} else {
			this.selectedPos = 0;
			this.selectedWidth = this.newPos + "px";
		}
	}
	//Если это переключение режима
	else if (this.changeMode) {
		if (this.switchToSingleMode) {//переключение в Single режим
			this.selectedPos = 0;
			this.selectedWidth = this.leftControl.style.top;
		}

		else if (this.switchToDoubleMode) {//переключение в Double режим
			this.selectedPos = parseFloat(this.leftControl.style.top);
			this.selectedWidth = parseFloat(this.rightControl.style.top) - parseFloat(this.leftControl.style.top) + 'px';
		}

		else if (this.switchToVerticalMode) {//переключение в вертикальный режим
		}

		else if (this.switchToHorizontalMode) {//переключение в горизонтальный режим
		}
	}

	this.progressBarUpdated(this.selectedPos, this.selectedWidth); //Вызываем для обновления прогресс бара в view

}