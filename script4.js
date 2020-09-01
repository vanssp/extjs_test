Ext.onReady(function(){
Ext.Ajax.request({
    url: 'static/js/token.json',
    failure: function(response, options){
         var loginForm=Ext.create('Ext.form.Panel',{
                title: 'Авторизация',
                id: 'authPanel',
                width: 300,
                height:150,
                bodyPadding:10,
                layout: 'anchor',
                defaults: {
                    anchor: '80%'
                },
                renderTo: Ext.getBody(),
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Логин',
                    name: 'login'
                },
                {
                    xtype: 'textfield',
                    name: 'pass',
                    fieldLabel: 'Пароль',
                    inputType: 'password'
                }],
                buttons: [{
                    text: 'Вход',
                    handler: function() {
                        loginForm.getForm().submit({
                            url: '/login',
                            success: function(form, action){
                                Ext.MessageBox.alert('Авторизация пройдена.',action.result.message);
                                token = action.result.token
                                Ext.Ajax.request({
                                                method: 'POST',
                                                url: '/protected'+'?token=' + token,
                                                success: function(response){
                                                },
                                                failure: function(response) {
                                                    alert('Произошла ошибка')
                                                    },
                                                callback: function() {
                                                }
                                            });
                                var bigPannel=Ext.create('Ext.Panel', {
                                    title: 'Добро пожаловать, ' + action.result.login,
                                    buttons: [
                                    {
                                        text: 'Выйти',
                                        handler: function() {
                                            Ext.MessageBox.alert('Заходите к нам ещё');
                                            bigPannel.destroy();
                                            loginForm.show();
                                        }
                                            }
                                    ],
                                    width: 800,
                                    height: 200,
                                    id : 'bigPannel',
                                    renderTo: Ext.getBody()
                                });
                                Ext.getCmp('bigPannel').insert(0, {
                                title: 'Панель',
                                width: 1600,
                                height: 200,
                                html:'Вот это панель'
                                });
                                loginForm.hide();
                            },
                            failure: function(form, action){
                                Ext.MessageBox.alert('Ошибка авторизации. ',action.result.message);
                                loginForm.show();
                            }
                        })
                }}]
        })
    },
    success: function(response, options){
         var bigPannel=Ext.create('Ext.Panel', {
                                    title: 'Добро пожаловать',
                                    buttons: [
                                    {
                                        text: 'Выйти',
                                        handler: function() {
                                            Ext.MessageBox.alert('Заходите к нам ещё');
                                            bigPannel.destroy();
                                        }
                                            }
                                    ],
                                    width: 800,
                                    height: 200,
                                    id : 'bigPannel',
                                    renderTo: Ext.getBody()
                                });
                                Ext.getCmp('bigPannel').insert(0, {
                                title: 'Панель',
                                width: 1600,
                                height: 200,
                                html:'Вот это панель'
                                });
    }
})
});