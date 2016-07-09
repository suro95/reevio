$("document").ready(function(){
	$(document).on('change','.translate',function(){
		var _this = this;
		if($(_this).val().length){
			$('#loader-wrapper').css('opacity','0.7');
			$('#loader-wrapper').show();
			if($(_this).val() == 'reset'){
				ResetText();
			}else{
				Translate($(_this).val(),$(_this).attr('data-lang'));
				$(_this).attr('data-lang',$(_this).val());
			}
		}
	});

	$(document).on('click','.reset_text', function(e){
		var my_InsertedTempladeData = {};
		$.each(InsertedTempladeData,function(slide_position,value){
			$.each(value,function(slide_id,val){
				my_InsertedTempladeData[slide_position] = val;
			})
		});
		$.each(DefaultTemplate,function(i,e){
			if(typeof my_InsertedTempladeData[i] != 'undefined'){
				if(typeof my_InsertedTempladeData[i]['inputs'] != 'undefined'){
					$.each(e.inputs,function(key,val){
						$('.current-slide[data-id="'+i+'"] a[data-inputposition="'+key+'"]').editable('setValue',val.value);

						$('.current-slide[data-id="'+i+'"] a[data-inputposition="'+key+'"]').removeClass('editable-unsaved');
						delete my_InsertedTempladeData[i]['inputs'];
						peercents();
						var count_inputs = Object.keys(TemplateData[i]["inputs"]).length;
						$(".image-container[data-id="+i+"] .steps .validate-inputs").text('0/'+count_inputs);
					})
				}
			}
		})
		peercents();
		selected_slide();
	});

	$(document).on('change','.category_tag',function(){
		var _this = this;
		if($(_this).val() == 0){
			$('.sidebar-right figure').show();
		}else{
			$('.sidebar-right figure').each(function(key,val){
				if($(_this).val() == $(val).attr('data-category')){
					$(val).show();
				}else{
					$(val).hide();
				}
			});
		}
	});
});

function Translate(newLang,Lang){
	var i =0;
	$.each( InsertedTempladeData, function( position_id, position ) {
		$.each(position, function( slide_id, slide ) {
			if(typeof TemplateData[slide_id]['inputs'] != 'undefined'){
				var j = 0;
				$.each(TemplateData[slide_id]['inputs'], function( inputs_id, inputs ) {
					if(typeof InsertedTempladeData[position_id][slide_id]['inputs'] != 'undefined' && typeof InsertedTempladeData[position_id][slide_id]['inputs'][inputs_id] != 'undefined'){
						var valInsert = InsertedTempladeData[position_id][slide_id]['inputs'][inputs_id].value;

					}else{
						var valInsert = '';
					}
					var valTemplate = TemplateData[slide_id]['inputs'][inputs_id].value;
					var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160429T135635Z.6feb8f7c5fb60ac6.ae4bf6db55c1f7b6bdb35c531697925ccc124651&text='+valTemplate+'&text='+valInsert+'&lang='+Lang+'-'+newLang;
						$.get(url, function(data){
							TemplateData[slide_id]['inputs'][inputs_id].value= data.text[0];
							TemplateDataRigth[slide_id]['inputs'][inputs_id].value= data.text[0];
							$('.current-slide[data-id="'+position_id+'"] .text-editor[data-inputname="'+inputs_id+'"]').editable('setValue',data.text[0]);

							if(data.text[1] != ""){
								$('.current-slide[data-id="'+position_id+'"] .text-editor[data-inputname="'+inputs_id+'"]').editable('setValue',data.text[1]);
								InsertedTempladeData[position_id][slide_id]['inputs'][inputs_id].value= data.text[1];
							}
							j++;
							if(j == Object.keys(TemplateData[slide_id]['inputs']).length){
								i++;
								if(i == Object.keys(InsertedTempladeData).length){
									$('#loader-wrapper').hide();
									$('#loader-wrapper').css('opacity','1');
								}
							}
						});
				});
			}else{
				i++;
				if(i == Object.keys(InsertedTempladeData).length){
					$('#loader-wrapper').hide();
					$('#loader-wrapper').css('opacity','1');
				}
			}
		});
	});
};

function ResetText(){
	var i =0;
	$.each( InsertedTempladeData, function( position_id, position ) {
		$.each(position, function( slide_id, slide ) {
			if(typeof DefaultTemplate[slide_id]['inputs'] != 'undefined'){
				var j = 0;
				$.each(DefaultTemplate[slide_id]['inputs'], function( inputs_id, inputs ) {
					if(typeof DefaultInsertedTempladeData[position_id][slide_id]['inputs'] != 'undefined' &&
						typeof DefaultInsertedTempladeData[position_id][slide_id]['inputs'][inputs_id] != 'undefined' &&
						typeof InsertedTempladeData[position_id][slide_id]['inputs'] != 'undefined' &&
						typeof InsertedTempladeData[position_id][slide_id]['inputs'][inputs_id] != 'undefined'){
						InsertedTempladeData[position_id][slide_id]['inputs'][inputs_id]['value'] = DefaultInsertedTempladeData[position_id][slide_id]['inputs'][inputs_id].value;
						$('.current-slide[data-id="'+position_id+'"] .text-editor[data-inputname="'+inputs_id+'"]').editable('setValue',DefaultInsertedTempladeData[position_id][slide_id]['inputs'][inputs_id].value);
					}else{
						TemplateData[slide_id]['inputs'][inputs_id]['value'] = DefaultTemplate[slide_id]['inputs'][inputs_id].value;
						$('.current-slide[data-id="'+position_id+'"] .text-editor[data-inputname="'+inputs_id+'"]').editable('setValue',DefaultTemplate[slide_id]['inputs'][inputs_id].value);
					}

					j++;
					if(j == Object.keys(DefaultTemplate[slide_id]['inputs']).length){
						i++;
						if(i == Object.keys(InsertedTempladeData).length){
							$('#loader-wrapper').hide();
							$('#loader-wrapper').css('opacity','1');
						}
					}
				});
			}else{
				i++;
				if(i == Object.keys(InsertedTempladeData).length){
					$('#loader-wrapper').hide();
					$('#loader-wrapper').css('opacity','1');
				}
			}
		});
	});
};

text = new TextValidation();

function TextValidation(){

};

TextValidation.prototype.checkStr = function(str){
	var is_valid = true,
		_this = this;

	for(i in str){
		if(!_this.English(str[i])
			&& !_this.Spanish(str[i])
			&& !_this.Portuguese(str[i])
			&& !_this.French(str[i])
			&& !_this.German(str[i])
			&& !_this.Italian(str[i])){
			is_valid = false;
		}
	}

	return is_valid;
};

TextValidation.prototype.English = function(char){
	var language = /[\u0000-\u007F]/;
	return language.test(char);
};

TextValidation.prototype.Spanish = function(char){
	var language = /[0-9a-zA-Zñáéíóúü]/;
	return language.test(char);
};

TextValidation.prototype.Portuguese = function(char){
	var language = /[a-z\u00E0-\u00FC]/;
	return language.test(char);
};

TextValidation.prototype.French = function(char){
	var language = /[a-zA-ZàâäôéèëêïîçùûüÿæœÀÂÄÔÉÈËÊÏÎŸÇÙÛÜÆŒ]/;
	return language.test(char);
};

TextValidation.prototype.German = function(char){
	var language = /[a-zA-ZäöüßÄÖÜẞ]/;
	return language.test(char);
};

TextValidation.prototype.Italian = function(char){
	var language = /[a-zA-ZàèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]/;
	return language.test(char);
};