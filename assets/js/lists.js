$(function() {
    $('section').on('click', 'article', function(){
        var $element = $(this);
        var items = JSON.parse(localStorage.getItem('list_items'));
        var id = $element.data('id');
        
        $.each(items.items, function(key, article ) {
            if (article.id !== id) {
                return;
            }
            
            if (article.finished) {
                items.items[key].finished = false;
                $element.removeClass('finished');
                return;
            } 
            
            $element.addClass('finished');
            items.items[key].finished = true;
        });
        
        localStorage.setItem('list_items', JSON.stringify(items));
    });
    
    $('section').on('click', '[data-action="delete"]', function(){
        var $article = $(this).closest('article');
        var items = JSON.parse(localStorage.getItem('list_items'));
        var id = $article.data('id');
        var newItems = {"items": []};
        $.each(items.items, function(key, article ) {
            if (article.id === id) {
                $article.remove();
                return;
            }
            newItems.items.push(article); 
        });
        
        localStorage.setItem('list_items', JSON.stringify(newItems));
    });
    
    var items = JSON.parse(localStorage.getItem('list_items'));
    if (items) {
        $.each(items.items, function(key, article ) {
            var listItem = $('<article>');
            listItem.data('id', article.id);
            if (article.finished) {
                listItem.addClass('finished');
            }   
            listItem.append(article.quantity);
            listItem.append($('<small>' + article.unit + '</small>'));
            listItem.append($('<span class="title">'+ article.title + '</span>'));
            var actions = $('<div class="actions"><button class="button button--link" data-action="delete"><svg shape-rendering="geometricPrecision" class="icon-remove"><use href="#icon-remove"></use></svg></button></div>');
            listItem.append(actions);
            $('section[data-list-item-wrapper]').append(listItem);
        });

    }
    
    $('form[data-submit="ajax"]').on('submit', function(e){
        var $form = $(this);
        var items = JSON.parse(localStorage.getItem('list_items'));
        if (items && items.items) {
            var id = $.map(items.items, function(n, i) { return i; }).length;
        } else {
            var id = 0;
        }
        var article = {"id": id, "finished": false};
        $.each($('form').serializeArray(), function(key, input ) {
            if (input.name === 'title') {
                article['title'] = input.value;
            }
            
            if (input.name === 'quantity') {
                article['quantity'] = input.value;
                
            }
            
            if (input.name === 'unit') {
                article['unit'] = input.value;
            }
        });
        
        if (items && items.items) {
            items.items.push(article); 
        } else {
            items = {
                "items": [
                   article,
                ]
            };
        }
        localStorage.setItem('list_items', JSON.stringify(items));
        e.preventDefault();
        if ($form.attr('action')) {
            window.location.href = $form.attr('action');
        }
    });
});