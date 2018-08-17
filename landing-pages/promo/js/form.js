(function (yabbu, undefined) {

  yabbu.init = function () {
    yabbu.form();
    yabbu.faq();
  };

  yabbu.faq = function(){
    var  $faqItems = document.getElementsByClassName('faq-item');
    var  $faqHeads = document.getElementsByClassName('faq-headline');
    var $faqTxts = document.getElementsByClassName('faq-txt');
    var $faqTxtsHeights = [];

    for (var i = 0; i < $faqTxts.length; i++) {
      $faqTxtsHeights.push($faqTxts[i].clientHeight);
    }

    var closeFaqs = function(){
      for (var i = 0; i < $faqTxts.length; i++) {
        $faqTxts[i].classList.remove('show');
        $faqHeads[i].classList.remove('show');
        $faqTxts[i].style.height = '0px';
      }
    }
    var toggleFaqItems = function(itemId){
      closeFaqs();
      $faqTxts[itemId].classList.add('show');
      $faqHeads[itemId].classList.add('show');
      $faqTxts[itemId].style.height = $faqTxtsHeights[itemId] + 'px';
    }
    for (var i = 0; i < $faqHeads.length; i++) {
      $faqHeads[i].addEventListener('click', function(){
        toggleFaqItems(this.dataset.faq);
      })
    }
    closeFaqs();
    $faqTxts[0].style.height = $faqTxtsHeights[0] + 'px';
    $faqHeads[0].classList.add('show');
    $faqTxts[0].classList.add('show');
  }//FAQ accordion


  yabbu.formInputChange = function(iClass){
    var $inputGroup =   document.getElementsByClassName('form-group ' + iClass )[0]
    $inputGroup.classList.remove('error');
    }

  yabbu.form = function () {

    // var apiUrl =  'https://yabbu.com/mailinglist/promo/subscribe' ;
    var apiUrl =  'https://app.yabbu.com/mailinglist/promo';
    var apiUrlNewsletter =  'https://app.yabbu.com/mailinglist/subscribe';
    var promoCodes = { 1:'YB6687', 2:'YB6682'}
    var $form = document.getElementById('promoForm');
    var emptyFields = [];
    var promoUserGroup = null;
    var newsletter = false;

    var markEmptyFields = function(){
      var $formGroups = document.getElementsByClassName('form-group');
      for (var i = 0; i < $formGroups.length; i++) {
        $formGroups[i].classList.remove('error');
      }
      for (var i = 0; i < emptyFields.length; i++) {
        var $emptyInput = document.getElementById(emptyFields[i]);
        $emptyInput.parentNode.classList.add('error');
      }
    }

    var validateFormData = function(data){
      var formValid = true;

      for (var key in  data) {
        if( !data[key].length > 0 || data[key] == " " ){
          emptyFields.push(key);
          formValid = false;
        }
      }
      if(data['promoCode'] !== promoCodes[1] && data['promoCode'] !== promoCodes[2]){
        emptyFields.push('promoCode');
        formValid = false;
      }else{
        promoUserGroup = data['promoCode'] == promoCodes[1] ? 1 : 2.
      }
      if( data['email'] ==' ' || data['email'].length < 0 || data['email'] == undefined || !data['email'].includes("@") || !data['email'].includes(".") ) {
        emptyFields.push('email');
        formValid = false;
      }

      markEmptyFields();
      return formValid;
    }//validate form


    var $formErrorGeneral = document.getElementById('formErrorGeneral');
    var sendMail = function(formData){
      if(validateFormData(formData)){

        $form.classList.add('sending');
        var $successMessage = document.getElementById('successMessage');
        var dataJson = JSON.stringify(formData);
        var apiUrlFinal = apiUrl + promoUserGroup + '/subscribe';

        var requestP = new XMLHttpRequest();
        requestP.onload = function () {
          var status = requestP.status;
          var data = requestP.responseText;
          $form.classList.remove('sending');
          if(status == 200){
            // console.log('success FRONT -> ', request, status);
            $successMessage.classList.add('show');
            $form.classList.add('hide');
            $formErrorGeneral.classList.remove('show');
          }else{
            console.log('error FRONT -> ', requestP,  'Status: ' + status);
            $successMessage.classList.remove('show');
          }
        }
        requestP.open("POST", apiUrlFinal, true);
        requestP.setRequestHeader('Content-Type', 'application/json');
        requestP.send(dataJson);

        if(newsletter){
          var requestN = new XMLHttpRequest();
          requestN.onload = function () {
          }
          // request.open("POST", apiUrlNewsletter, true);
          requestN.open("POST", apiUrlNewsletter, true);
          requestN.setRequestHeader('Content-Type', 'application/json');
          requestN.send(dataJson);
        }

      }
    };

    $form.addEventListener('submit', function(event, data){
      event.preventDefault();
      emptyFields = [];
      var firstname = document.getElementById('firstname').value;
      var lastname = document.getElementById('lastname').value;
      var email = document.getElementById('email').value;
      var promoCode = document.getElementById('promoCode').value;
      newsletter = document.getElementById('newsletterCheckbox').checked;
      var formData = { firstname: firstname, lastname: lastname, email:email, promoCode: promoCode,  languageCode: "gb" };
      sendMail(formData);
    });

  };

  yabbu.init();

}(window.yabbu = window.yabbu || {} ));
